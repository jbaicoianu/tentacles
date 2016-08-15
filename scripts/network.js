/*
 *   {
 *     "self": ["192.168.42.74"],
 *     "connections": {
 *       "start": [{"src": "192.168.42.74:42378", "dst": "174.143.151.4:80"}],
 *       "ack": [{"src": "192.168.42.74:42378", "dst": "174.143.151.4:80"}],
 *       "error": [],
 *       "close": []
 *     },
 *     "hosts": {
 *       "192.168.42.1": false,
 *       "173.228.127.1": "173-228-127-1.dsl.dynamic.sonic.net",
 *       "173.228.20.77": "gig1-18.cr1.snrsca01.sonic.net",
 *       "70.36.205.70": "202.cr1.snrfca01.sonic.net",
 *       "75.101.33.162": "po4.cr1.colaca01.sonic.net",
 *       "75.101.33.166": "po3.cr1.lsatca11.sonic.net",
 *       "69.12.211.1": "0.xe-5-1-0.gw.pao1.sonic.net",
 *       "64.142.0.109": "0.xe-6-1-0.gw2.200p-sf.sonic.net",
 *       "208.106.96.249": "as0.gw.200p-sf.sonic.net",
 *       "4.53.134.9": "xe-10-1-0.bar2.SanFrancisco1.Level3.net",
 *       "4.69.140.145": "ae-0-11.bar1.SanFrancisco1.Level3.net",
 *       "4.69.140.150": "ae-1-4.ebr1.SanJose5.Level3.net",
 *       "4.69.148.110": "ae-1-100.ebr2.SanJose5.Level3.net",
 *       "4.69.148.201": "ae-6-6.ebr2.LosAngeles1.Level3.net",
 *       "4.69.132.78": "ae-3-3.ebr3.Dallas1.Level3.net",
 *       "4.69.151.169": "ae-93-93.csw4.Dallas1.Level3.net",
 *       "4.69.145.210": "ae-4-90.edge10.Dallas1.Level3.net",
 *       "4.28.44.162": false,
 *       "74.205.108.114": "edge6-coreb.dfw1.rackspace.net",
 *       "74.205.108.31": "core7.dfw1.rackspace.net",
 *       "98.129.84.217": false,
 *       "174.143.151.4": "meobets.com"
 *     },
 *     "hops": {
 *       "174.143.151.4": {
 *         0: ["192.168.42.74", 0.0],
 *         1: ["192.168.42.1", 0.5],
 *         2: ["173.228.127.1", 22.8],
 *         3: ["173.228.20.77", 20.1],
 *         4: ["70.36.205.70", 21.3],
 *         5: ["75.101.33.162", 21.8],
 *         6: ["75.101.33.166", 22.3],
 *         7: ["69.12.211.1", 22.1],
 *         8: ["64.142.0.109", 23.1],
 *         9: ["208.106.96.249", 24.2],
 *         10: ["4.53.134.9", 23.9],
 *         11: ["4.69.140.145", 24.4],
 *         12: ["4.69.140.150", 66.9],
 *         13: ["4.69.148.110", 67.0],
 *         14: ["4.69.148.201", 67.0],
 *         15: ["4.69.132.78", 66.5],
 *         16: ["4.69.151.169", 66.1],
 *         17: ["4.69.145.210", 66.2],
 *         18: ["4.28.44.162", 67.4],
 *         19: ["74.205.108.114", 67.0],
 *         20: ["74.205.108.31", 67.5],
 *         21: ["98.129.84.217", 67.7],
 *         22: ["174.143.151.4", 67.8]
 *       },
 *       "74.125.239.36": {
 *         1: ["192.168.42.1", 7.492],
 *         2: ["173.228.127.1", 32.208],
 *         3: ["173.228.20.77", 34.096],
 *         4: ["70.36.205.70", 37.948],
 *         5: ["75.101.33.162", 43.292],
 *         6: ["75.101.33.166", 84.111],
 *         7: ["69.12.211.1", 77.752],
 *         8: ["64.142.0.185", 122.132],
 *         9: ["206.223.116.21", 60.485],
 *         10: ["216.239.49.168", 62.256],
 *         11: ["72.14.232.35", 35.232],
 *         12: ["74.125.239.36", 47.438],
 *       },
 *       "38.104.134.222": {
 *         1: ["192.168.42.1", 7.001],
 *         2: ["173.228.127.1", 27.525],
 *         3: ["173.228.20.77", 30.232],
 *         4: ["70.36.205.70", 34.543],
 *         5: ["75.101.33.162", 38.000],
 *         6: ["75.101.33.166", 39.093],
 *         7: ["69.12.211.1", 36.716],
 *         8: ["38.104.141.81", 26.101],
 *         9: ["154.54.28.81", 29.100],
 *         10: ["154.54.5.113", 29.480],
 *         11: ["154.54.27.22", 31.402],
 *         12: ["38.104.134.222", 29.249],
 *       },
 *       "216.218.186.2": {
 *         1: ["192.168.42.1", 20.829],
 *         2: ["173.228.127.1", 45.756],
 *         3: ["173.228.20.77", 48.077],
 *         4: ["70.36.205.70", 50.642],
 *         5: ["75.101.33.162", 55.877],
 *         6: ["75.101.33.166", 57.821],
 *         7: ["69.12.211.1", 34.728],
 *         8: ["64.142.0.185", 36.596],
 *         9: ["206.223.116.37", 60.729],
 *         10: ["72.52.92.109", 75.823],
 *         11: ["216.218.186.2", 66.722],
 *       },
 *       "149.174.32.194": {
 *         1: ["192.168.42.1", 2.177],
 *         2: ["173.228.127.1", 26.774],
 *         3: ["173.228.20.77", 29.428],
 *         4: ["70.36.205.70", 33.686],
 *         5: ["75.101.33.162", 36.280],
 *         6: ["75.101.33.166", 40.488],
 *         7: ["69.12.211.1", 34.814],
 *         8: ["38.104.141.81", 46.999],
 *         9: ["154.54.5.105", 56.392],
 *         10: ["154.54.82.90", 54.856],
 *         11: ["154.54.13.2", 62.794],
 *         12: ["66.185.150.80", 61.249],
 *         13: ["66.185.152.171", 95.544],
 *         14: ["66.185.144.195", 94.353],
 *         15: ["66.185.141.66", 100.564],
 *         16: ["66.185.150.34", 104.554],
 *         17: ["149.174.32.194", 100.521],
 *       }
 *     },
 *     "networks": {
 *       "173.228.112.0/20": { "owner": "Sonic.net, Inc.", },
 *       "173.228.16.0/20": { "owner": "Sonic.net, Inc." },
 *       "70.36.192.0/20": { "owner": "Sonic.net, Inc." },
 *       "75.101.32.0/19": { "owner": "Sonic.net, Inc." },
 *       "69.12.192.0/18": { "owner": "Sonic.net, Inc." },
 *       "64.142.0.0/18": { "owner": "Sonic.net, Inc." },
 *       "208.106.96.0/20": { "owner": "Sonic.net, Inc." },
 *       "4.0.0.0/8": { "owner": "Level 3 Communications, Inc." },
 *       "74.205.0.0/17": { "owner": "Rackspace Hosting" },
 *       "98.129.84.0/24": { "owner": "Rackspace Backbone Engineering" },
 *       "174.143.0.0/16": { "owner": "Rackspace Hosting" }
 *     }
 *   });
 */


elation.require(['utils.template'], function() {
  elation.template.add('network.device', '<h2>{host.name}</h2>');
  elation.template.add('network.interface', '<h2>{interface.name}</h2>');
  elation.template.add('network.address', '<h2>{address.ip}</h2>');

  elation.component.add("network.explore", function() {
    this.host = false;
    this.networks = {};
    this.peers = {};

    this.init = function() {
      console.log('new fucker', this.args);
      this.device = new elation.network.device(this.args.device);
  console.log(this.args);
      for (var k in this.args.hosts) {
        this.hosts[k] = new elation.network.device(this.args.hosts[k]);
        var div = elation.html.create({classname: 'network_device'});
        div.innerHTML = elation.template.get('network.device', {host: this.hosts[k]});
        this.container.appendChild(div);
      }
    }
    this.merge = function(data) {
      if (data.networks) this.add_networks(data.networks);
      if (data.peers) this.add_peers(data.peers);
    }
    this.add_networks = function(networks) {
      for (var k in networks) {
        this.networks[k] = new elation.network.subnet(networks[k]);
      }
    }
  });

  elation.extend("network.device", function(args) {
    this.name = '(unknown)';
    this.interfaces = {};
    this.addresses = {};

    this.init = function() {
      this.name = args.name;
      this.set_interfaces(args.interfaces);
      this.set_addresses(args.addresses);
    }

    this.set_interfaces = function(interfaces) {
      for (var k in interfaces) {
        this.interfaces[k] = new elation.network.interface(interfaces[k]);
      }
    }
    this.set_addresses = function(addresses) {
      for (var k in addresses) {
        this.addresses[k] = new elation.network.address(addresses[k]);
      }
    }
    this.get_networks = function() {
      var addrs = {};
      for (var iface in this.interfaces) {
        for (var link in this.interfaces[iface].links) {
          for (var addr in this.interfaces[iface].links[link].addresses) {
            addrs[addr] = this.interfaces[iface].links[link].addresses[addr];
          }
        }
      }
      return addrs;
    }
    this.init();
  });
  elation.extend("network.interface", function(args) {
    this.name = "(unknown)";
    this.link = false;
    this.addresses = {};
    this.stats = {};

    this.init = function() {
      this.name = args.name;
      if (args.link) {
        this.set_link(args.link);
      }
      if (args.stats) {
        this.update_stats(args.stats);
      }
      if (args.addresses) {
        this.set_addresses(args.addresses);
      }
      console.log('new interface: ' + this.name);
    }
    this.set_link = function(link) {
      this.link = new elation.network.link(link);
    }
    this.set_addresses = function(addresses) {
      for (var k in addresses) {
        this.add_address(addresses[k]);
      }
    }
    this.add_address = function(address) {
      this.addresses[address.ip] = new elation.network.address(address);
    }
    this.update_stats = function(stats) {
      this.stats = stats;
    }
    this.init();
  });
  elation.extend("network.subnet", function(args) {
    this.address = false;
    this.prefix = 0;

    this.init = function() {
      if (this.args.cidr) {
        var parts = this.args.cidr.split('/');
        this.address = parts[0];
        this.prefix = parts[1];
      } else {
        this.address = args.address;
        this.prefix = args.prefix;
      }
      console.log('new subnet: ' + this.address + '/' + this.prefix);
    }
    this.getmask = function() {
      return -1 << (32 - this.prefix);
    }
    this.init();
  });
  elation.extend("network.link", function(args) {
    this.mac = "(unknown)";

    this.init = function() {
      this.mac = args.mac;
    }
    this.init();
  });
  elation.extend("network.address", function(args) {
    this.ip = "(unknown)";
    this.network = 32;

    this.init = function() {
      this.ip = args.ip;
      this.network = args.network;
    }
    this.init();
  });
});
