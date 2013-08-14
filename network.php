<?php

class Component_network extends Component {
  public function init() {
    OrmManager::LoadModel("network");
  }

  public function controller_network($args) {
    $vars = array();

    $vars["data"]["device"] = LinuxNetwork::get_host_device();
    $vars["data"]["networks"] = LinuxNetwork::get_networks();

    return $this->GetComponentResponse("./network.tpl", $vars);
  }
  /**
   * Perform DNS lookups on the provided list of hosts
   */
  public function controller_lookup($args) {
    if (!empty($args["addrs"])) {
      $addrs = explode(",", $args["addrs"]);
      foreach ($addrs as $addr) {
        try {
          $host = @gethostbyaddr($addr);
          if ($host != $addr) {
            $vars["hosts"][$addr] = $host;
          } else {
            $vars["hosts"][$addr] = false;
          }
        } catch (Exception $e) {
          $vars["hosts"][$addr] = false;
        }
      }
    }
    return $this->GetComponentResponse("./lookup.tpl", $vars);
  }
  /**
   * Perform a traceroute to the provided host
   */
  public function controller_trace($args) {
    if (!empty($args["host"])) {
      $host = $args["host"];
      // old-style traceroute
      /*
      $lines = explode("\n", `traceroute -w 2 -q 1 -n $host |tail -n +2 |awk '{print $1 "," $2 "," $3}'`);
      foreach ($lines as $line) {
        $line = trim($line);
        if (!empty($line)) {
          list($num,$router,$latency) = explode(",", trim($line));
          if ($router != "*") {
            $vars["hops"][$host][$num] = array($router, $latency);
          }
        }
      }
      */
      // traceroute using mtr gives much more reliable and stable results
      $lines = explode("\n", `mtr -c 1 -n --raw $host`);
      foreach ($lines as $line) {
        $parts = explode(" ", trim($line));
        switch ($parts[0]) {
          case 'h':
            $vars["hops"][$host][$parts[1]][0] = $parts[2];
            break;
          case 'p':
            $vars["hops"][$host][$parts[1]][1] = $parts[2];
            break;
        }
      }
    }
    return $this->GetComponentResponse("./trace.tpl", $vars);
  }
}  

class NetworkSubnet {
  public $address;
  public $prefix;

  public $devices;
}
class NetworkDevice {
  public $name;
  public $interfaces;
  public $addresses;

  public function NetworkDevice($name, $interfaces=null) {
    $this->name = $name;
    if ($interfaces !== null) {
      $this->set_interfaces($interfaces);
    }
  }
  public function add_interface($iface, $addresses=null) {
    $this->interfaces[$iface] = new NetworkInterface($iface, $addresses);
  }
  public function set_interfaces($interfaces) {
    $this->interfaces = $interfaces;
  }
  public function add_address($ip, $prefix, $iface=null) {
    if ($iface !== null) {
      $this->interfaces[$iface]->add_address($ip, $prefix);
    }
    $this->addresses[$ip] = new NetworkAddress($ip, $prefix);
  }
}
class NetworkInterface {
  //public $device;
  public $name;
  public $link;
  public $addresses;
  public $stats;

  public function NetworkInterface($name, $addresses=null) {
    $this->name = $name;
  }
  public function set_link($type, $address, $args) {
    $this->link = new NetworkLink($type, $address, $args);
    return $this->link;
  }
  public function add_address($ip, $network, $args=null) {
    $this->addresses[$ip] = new NetworkAddress($ip, $network, $args);
  }
  public function update_stats($stats) {
    $cols = array(
      "recv.bytes", "recv.packets", "recv.err", "recv.drop", "recv.fifo", "recv.frame", "recv.compressed", "recv.multicast",
      "send.bytes", "send.packets", "send.err", "send.drop", "send.fifo", "send.frame", "send.compressed", "send.multicast"
    );

    for ($i = 0; $i < count($stats); $i++) {
      array_set($this->stats, $cols[$i], $stats[$i]);
    }
  }
}
class NetworkLink {
  public $type;
  public $mac;
  public $capacity;

  public function NetworkLink($type, $mac, $broadcast) {
    $this->type = $type;
    $this->mac = $mac;
  }
}
class NetworkAddress {
  public $ip;
  public $prefix;

  public function NetworkAddress($ip, $prefix, $args=null) {
    $this->ip = $ip;
    $this->prefix = $prefix;
  }
}

class LinuxNetwork {
  public static function get_hostname() {
    $hostname = trim(file_get_contents("/etc/hostname"));
    return $hostname;
  }
  public static function get_host_device() {
    $device = new NetworkDevice(self::get_hostname());
    $cmd = "ip addr show";
    $cmdout = `$cmd`;
    $lines = explode("\n", $cmdout);
    $ifaces = array();
    $currentiface = null;
    for ($i = 0; $i < count($lines); $i++) {
      if (preg_match("/^\d+: (.*?)(?:@.*?)?: <(.*?)> (.*)$/", $lines[$i], $m)) {
        $currentiface = $m[1];
        $device->add_interface($m[1]);
      } else if (preg_match("/^\s+link\/(.*?) ([0-9a-f:]{17}) brd ([0-9a-f:]{17})/", $lines[$i], $m)) {
        $device->interfaces[$currentiface]->set_link($m[1], $m[2], $m[3]);
      } else if (preg_match("/^\s+inet ([\d\.]+)\/(\d+) (.*)$/", $lines[$i], $m)) {
        $device->add_address($m[1], $m[2], $currentiface);
      }
    }

    self::get_interface_stats($device->interfaces);

    return $device;
  }
  public static function get_interface_stats($ifaces) {
    $file = "/proc/net/dev";
    $contents = file($file);
    for ($i = 2; $i < count($contents); $i++) {
      $parts = explode("\t", trim(preg_replace("/\s+/", "\t", $contents[$i])));
      $namepart = array_shift($parts);
      $ifname = substr($namepart, 0, -1);
      if (!empty($ifaces[$ifname]) && $ifaces[$ifname] instanceof NetworkInterface) {
        $ifaces[$ifname]->update_stats($parts);
      }
    }
  }
  public static function get_networks() {
    $cmd = "ip route show";
    $cmdout = `$cmd`;
    $lines = explode("\n", $cmdout);
  }
}
