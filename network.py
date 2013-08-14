#!/usr/bin/python

import socket, struct, dpkt, pcap
import subprocess, re, jsonpickle
import multiprocessing
import dns, dns.reversename, dns.resolver
import time

'''
 Tasks:

 - monitor pcap for SYN, RST, retransmits, etc. to determine tcp connections
 - for each connection:
   - send CONNECTION [OPEN|ACK|ERROR|CLOSE] to client for all state changes
   - (async) perform dns lookup for host ip, send HOST RESOLVE to client
   - (async) traceroute host to determine path, send HOST TRACE to client for each hop as we receive them
   - (async) whois ip to determine network owner, send NETWORK RESOLVE to client

 Basic actions/protocol:

  CONNECTION OPEN <src> <dst>
  CONNECTION ACK <src> <dst>
  CONNECTION ERROR <src> <dst>
  CONNECTION CLOSE <src> <dst>

  HOST RESOLVE <ip> [<hostname>]
  HOST TRACE <ip> [<hop> <hopip> <ping>]

  NETWORK resolve <ip> [<network> <prefix> <owner>]

'''

'''
Simple base class to allow for easy JSON serialization
'''
class NetworkBase:
  def __str__(self):
    return jsonpickle.encode(self, False)

'''
Classes to represent various levels of a network, as seen from this host
'''
class NetworkDevice(NetworkBase):
  def __init__(self, name):
    self.name = name
    self.interfaces = {}
    self.addresses = {}

  def add_interface(self, ifname):
    self.interfaces[ifname] = NetworkInterface(ifname)

  def add_address(self, ip, prefix, ifname):
    self.addresses[ip] = NetworkAddress(ip, prefix)

class NetworkInterface(NetworkBase):
  def __init__(self, name, mac=None):
    self.name = name
    self.mac = mac

  def set_link(self, type, mac, brd):
    self.mac = mac

class NetworkAddress(NetworkBase):
  hostname = None

  def __init__(self, ip, prefix):
    self.ip = ip
    self.prefix = prefix

'''
Utility class to abstract platform-specific network information gathering
'''
class LinuxNetwork:
  hostname = None

  def get_hostname(self):
    with open('/etc/hostname', 'r') as f:
      return f.read().rstrip()

  def get_host_device(self):
    cmdproc = subprocess.Popen(["ip", "addr", "show"], stdout=subprocess.PIPE)
    cmdout, cmderr = cmdproc.communicate()
    lines = cmdout.split('\n')
    currentiface = None
    device = NetworkDevice(self.get_hostname())

    re_iface = re.compile('^\d+: (.*?)(?:@.*?)?: <(.*?)> (.*)$')
    re_link = re.compile('^\s+link\/(.*?) ([0-9a-f:]{17}) brd ([0-9a-f:]{17})')
    re_addr = re.compile('^\s+inet ([\d\.]+)\/(\d+) (.*)$')

    for i in range(0, len(lines)):
      match = re_iface.match(lines[i])
      if match:
        currentiface = match.group(1)
        device.add_interface(match.group(1))
        continue
      match = re_link.match(lines[i])
      if match:
        device.interfaces[currentiface].set_link(match.group(1), match.group(2), match.group(3))
        continue
      match = re_addr.match(lines[i])
      if match:
        device.add_address(match.group(1), match.group(2), currentiface)
        continue

    return device

def lookuphost(inqueue, outqueue):
  addr = inqueue.get()
  #print "lookup %s" % (addr)
  hostinfo = dns.reversename.from_address(addr)
  hostname = None
  try:
    hostinfo = socket.gethostbyaddr(addr)
    hostname = hostinfo[0]
    #answer = dns.resolver.query(hostinfo, 'PTR')
    #print "got it: %s %s" % (answer.qname, answer.rrset)
    #hostname = str(answer.rrset)
  except (dns.resolver.NXDOMAIN, socket.herror):
    #print "%s not found" % (addr)
    pass
  outqueue.put([addr, hostname])
  return

class AsyncReverseResolver:
  def __init__(self):
    self.manager = multiprocessing.Manager()
    self.inqueue = self.manager.Queue()
    self.outqueue = self.manager.Queue()
    #self.pool = multiprocessing.Pool(processes=100)
    self.procs = []

  def queue(self, addr):
    self.inqueue.put(addr)
    #self.pool.apply_async(lookuphost, [self.inqueue, self.outqueue])
    proc = multiprocessing.Process(target=lookuphost, args=(self.inqueue, self.outqueue))
    proc.daemon = False
    proc.start()
    self.procs.append(proc)

  def begin(self):
    while not self.inqueue.empty():
      self.lookup_next()
  def join(self):
    for i in range(0,len(self.procs)):
      if resolve.procs[i].join(0):
        print "join dat shit: %d" % (i)

  def lookup_next(self, inqueue, outqueue):
    '''
    addr = inqueue.get()
    print "lookup %s" % (addr)
    try:
      hostinfo = socket.gethostbyaddr(addr)
      print hostinfo
      outqueue.put(hostinfo)
    except:
      pass
    '''
    print "hellz yeah"

def ip2str(ip):
  #return struct.pack('L',long(ip))
  return socket.inet_ntoa(ip)

'''
Experimental routine to capture SYN packets from pcap and report all new connections
This is where all the magic is supposed to happen (build a list of hosts, trigger 
async lookups, start traceroutes, etc)
'''
def pcap_capture():
  pc = pcap.pcap()
  pc.setfilter("tcp[13] & 2 == 2")

  decode = { pcap.DLT_LOOP:dpkt.loopback.Loopback,
             pcap.DLT_NULL:dpkt.loopback.Loopback,
             pcap.DLT_EN10MB:dpkt.ethernet.Ethernet }[pc.datalink()]

  for timestamp, packet in pc:
    #print dpkt.ethernet.Ethernet(packet)
    pkt = decode(packet)
    print "[%f] %s:%d => %s:%d" % (timestamp, ip2str(pkt.data.src), pkt.data.data.sport, ip2str(pkt.data.dst), pkt.data.data.dport)

network = LinuxNetwork()
device = network.get_host_device()
print device
pcap_capture()

if False:
  # test code for async resolver
  import random
  resolve = AsyncReverseResolver()
  #resolve.begin()
  #while not (resolve.inqueue.empty() and resolve.outqueue.empty() and resolve.inprogress == 0):
  while True:
    resolve.join()

    if not resolve.outqueue.empty():
      fuh = resolve.outqueue.get()
      print "durf:", fuh

    if random.randint(1,1000) == 1:
      for i in range(0,random.randint(1,5)):
        resolve.queue("64.124.%d.%d" % (random.randint(1,255), random.randint(1,255)))
