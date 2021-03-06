elation.component.add('network.traffic', function() {
  this.init = function() {
    elation.html.addclass(this.container, 'network_traffic');
    this.size = [window.innerWidth, window.innerHeight];
    this.graphzoom = 1;
    this.graphoffset = [0, 0];
    this.traces = {};

    // FIXME - these polling intervals won't be needed once websockets are hooked up
    this.tracetime = 10000;
    this.lookuptime = 2000;
    this.fadetime = this.tracetime * 10;

    this.initdata();
    this.inittraceui();
    this.initgraph();

    // FIXME - instead of looking up hosts on an interval, we should be streaming this data via websockets
    setInterval(elation.bind(this, this.lookuphosts), this.lookuptime);
  }
  this.initdata = function() {
    this.self = [];
    this.connections = [];
    this.hosts = {};

    if (this.args.addresses) {
      for (var k in this.args.addresses) {
        this.self.push(k);
      }
    }
  }
  /**
   * init force graph
   */
  this.initgraph = function() {
    this.force = d3.layout.force()
        .linkDistance(40)
        .linkStrength(10)
        .gravity(.05)
        .charge(-80)
        .size(this.size);
    this.hostnodes = this.force.nodes();
    this.links = this.force.links();
    this.force.on("tick", elation.bind(this, this.forcetick));


    // create svg container
    this.svg = d3.select(this.container).append('svg:svg')
        .attr('width', this.size[0])
        .attr('height', this.size[1]);

    this.svg.append('svg:rect')
        .attr('width', this.size[0])
        .attr('height', this.size[1]);
    elation.events.add(this.svg[0][0], 'mousedown,mousewheel', this);
    elation.events.add(window, 'resize', this);
  }
  /** 
   * trace UI setup
   */
  this.inittraceui = function() {
    // Post to a hidden iframe so that autocomplete will still work
    var traceframe = elation.html.create({tag: 'iframe', append: this.container});
    traceframe.src = "javascript:false";
    traceframe.id = "network_trace_iframe";
    traceframe.name = "network_trace_iframe";
    this.traceui = elation.html.create({tag: 'form', classname: 'network_traffic_trace', append: this.container});
    this.traceui.action = 'javascript:false';
    this.traceui.method = "GET";
    this.traceui.name = "network_trace";
    this.traceui.autocomplete = "off"; // FIXME - autocomplete is currently broken in chrome, hooray
    this.traceui.target = "network_trace_iframe";
    var traceinput = elation.html.create({tag: 'input', append: this.traceui});
    traceinput.name = "host";
    traceinput.placeholder = "Trace host";
    //elation.events.add(traceinput, 'change,keypress', elation.bind(this, this.handletrace));
    elation.events.add(this.traceui, 'submit', elation.bind(this, this.handletrace));
    traceinput.focus();
    this.tracetype = elation.ui.select(null, elation.html.create({tag: 'select', append: this.traceui}), {items: "icmp;tcp;udp", selected: "icmp"});

    this.tracelist = elation.ui.treeview(null, elation.html.create({tag: 'div', classname: 'network_trace_list', append: this.traceui}), {
      attrs: {
        label: 'dst',
        //visible: 'properties.pickable',
        //itemtemplate: 'engine.systems.admin.scenetree.thing'
      }
    });
  }

  /**
   * Add new data to the graph
   */
  this.mergedata = function(data) {
    if (data.self) {
      for (var i = 0; i < data.self.length; i++) {
        if (this.self.indexOf(data.self[i]) === -1) {
          this.self.push(data.self[i]);
        }
      }
    }
    if (data.connections) {
      for (var i = 0; i < data.connections.start.length; i++) {
        var conn = new elation.network.connection(this, data.connections.start[i]);
      }
    }  
    if (data.hops) {
      for (var host in data.hops) {
        var lasthop = false;
        for (var hop in data.hops[host]) {
          //var thishop = this.gethost(data.hops[host][hop][0], "router");
          var thishost = data.hops[host][hop][0];
          //    nexthost = (data.hops[host][hop+1] ? data.hops[host][hop+1][0] : false);
          if (lasthop) {
            var prevhost = data.hops[host][lasthop][0];
            var conn = new elation.network.connection(this, {src: prevhost, dst: thishost});
            this.links.unshift(conn);
          }
          lasthop = hop;
        }
      }
    }
    if (data.hosts) {
      for (var addr in data.hosts) {
        if (this.hosts[addr]) {
          this.hosts[addr].hostname = data.hosts[addr];
        }
      }
    }
    // Create new host markers as needed
    var gdata = this.svg.selectAll("g.network_host")
            .data(this.hostnodes, function(d) { return d.address; });

    var genter = gdata.enter().append("svg:g")
            .attr("class", function(d) { return "network_host" + (d.type ? " network_host_type_" + d.type : ""); })
            .attr("transform", function(d) { return "translate(" + d.x + ", " + d.y + ")"; });
    genter.append('svg:circle')
            .attr("r", 4.5)
/*
    genter.append("svg:text")
            .attr("class", "network_host_label_shadow")
            .attr("dx", 6)
            .attr("dy", 3)
            .text(function(d) { return d.hostname || d.address; });
*/
    genter.append("svg:text")
            .attr("class", "network_host_label")
            .attr("dx", 6)
            .attr("dy", 3)
            .text(function(d) { return d.hostname || d.address; });
    //gdata.exit()
    //  .remove();

    // Add network connection lines
    var linkdata = this.svg.selectAll("line.network_connection")
            .data(this.links);
    // FIXME - inserting before :first-child makes lines appear below nodes, but then the state_recent links get out of sync
    //linkdata.enter().insert("svg:line", ":first-child")
    linkdata.enter().append("svg:line")
            .attr("class", "network_connection state_recent")
            .attr("x1", function(d) { return d.src.x; })
            .attr("y1", function(d) { return d.src.y; })
            .attr("x2", function(d) { return d.dst.x; })
            .attr("y2", function(d) { return d.dst.y; })
    .transition()
      .delay(this.tracetime)
      .attr("class", "network_connection")
    .transition()
      .delay(this.fadetime)
      .each("end", elation.bind(this, function() { var link = this.links.shift(); link.close(); }))
      .remove();

    //linkdata.exit().remove();

    this.force.start();
  }
  /**
   * Returns a host object for the specified address, creating a new one if it doesn't exist
   */
  this.gethost = function(address, type) {
    var parts = address.split(':');
    if (parts.length > 0) address = parts[0];
    if (!type && this.self.indexOf(address) !== -1) {
      type = "self";
    }
    if (!this.hosts[address]) {
      this.hosts[address] = new elation.network.host(this, {address: address, type: type}); 
      this.hostnodes.push(this.hosts[address]);

      if (this.hostnodes.length == 1) {
        // Fix the first hostnode so the graph doesndoesn't rotate constantly
        this.hosts[address].fixed = true;
        this.hosts[address].x = 20;
        this.hosts[address].y = this.size[1] - 20;
      }
    }
    return this.hosts[address];
  }
  /**
   * Iterate force-directed graph node positions
   */
  this.forcetick = function() {
    var offset = this.graphoffset;
    var zoom = this.graphzoom;
    // FIXME - shouldn't this work automatically since we set the transform attr to a function on init?
    this.svg.selectAll("g.network_host")
            .attr("transform", function(d) { return "translate(" + ((d.x * zoom) + offset[0]) + ", " + ((d.y * zoom + offset[1])) + ")"; })
            .selectAll("text")
              .text(function(d) { return d.hostname || d.address; })
    this.svg.selectAll("line")
            .attr("x1", function(d) { return (d.src.x * zoom) + offset[0]; })
            .attr("y1", function(d) { return (d.src.y * zoom) + offset[1]; })
            .attr("x2", function(d) { return (d.dst.x * zoom) + offset[0]; })
            .attr("y2", function(d) { return (d.dst.y * zoom) + offset[1]; });
  }
  /**
   * Perform a host lookup for any unknown ip addresses
   */
  this.lookuphosts = function(count) {
    if (!count) count = 20;
    var hosts = [];
    for (var h in this.hosts) { 
      if (!this.hosts[h].hostname && this.hosts[h].hostname !== false && !this.hosts[h].hostnamepending) { 
        hosts.push(h);
        this.hosts[h].hostnamepending = true;
      }
      if (hosts.length > count) 
        break; 
    } 
    if (hosts.length > 0) {
      var allhosts = hosts.join(',');
      // TODO - implement websocket streaming of this data
      elation.ajax.Get('network/lookup.js?addrs=' + allhosts, null, {callback: elation.bind(this, function(d) { var response = JSON.parse(d); if (response.data) this.mergedata(response.data); })});
    }
  }
  /**
   * Ask server to traceroute host for us
   */
  this.tracehost = function(host, time) {
    if (!this.traces[host]) {
      this.traces[host] = new elation.network.trace(this, {dst: host, tracetime: time});
      this.tracelist.setItems(this.traces);
    }
    if (!this.traces[host].started) {
      this.traces[host].poll();
    }
  }
  /**
   * pan/zoom functions
   */
  this.zoom = function(amount, center) {
    if (!center) center = [.5, .5];
    var newzoom = this.graphzoom * amount;
    // FIXME - needs to take center into account while changing offset, currently zooms to top left corner
    var newoffset = [this.graphoffset[0] * amount, this.graphoffset[1] * amount];
    this.graphzoom = newzoom;
    this.graphoffset = newoffset;
  }

  /**
   * Handle new inputs from the traceroute UI
   */
  this.handletrace = function(ev) {
    // IE doesn't send onchange events when enter is pressed, so we use keypress and watch for \n instead
    //if (ev.type == 'keypress' && ev.keyCode != '13') return;

    var input = ev.target.host;
    var host = input.value;
    this.tracehost(host);

    setTimeout(elation.bind(input, function() { this.value = ''; }), 10);
    //ev.preventDefault();
  }
  /**
   * Handle resize events by making svg fit screen
   */
  this.resize = function(ev) {
    this.size = [window.innerWidth, window.innerHeight];
    this.force.size(this.size);
    this.svg.attr('width', this.size[0])
            .attr('height', this.size[1]);
  }
  /**
   * Mouse pan/zoom support
   */
  this.mousedown = function(ev) {
    if (ev.button == 0) {
      this.lastmousepos = [ev.clientX, ev.clientY];
      elation.events.add(window, 'mousemove,mouseup,mouseout', this);
    }
  }
  this.mousemove = function(ev) {
    if (this.lastmousepos) {
      var mousepos = [ev.clientX, ev.clientY];
      var diff = [mousepos[0] - this.lastmousepos[0], mousepos[1] - this.lastmousepos[1]];
      this.graphoffset[0] += diff[0];
      this.graphoffset[1] += diff[1];
      this.lastmousepos = mousepos;
      this.force.start();
    }
  }
  this.mouseup = function(ev) {
    elation.events.remove(window, 'mousemove,mouseup,mouseout', this);
    this.lastmousepos = false;
  }
  this.mouseout = function(ev) {
    if (ev.target == window) {
      elation.events.remove(window, 'mousemove,mouseup,mouseout', this);
      this.lastmousepos = false;
    }
  }
  this.mousewheel = function(ev) {
    var amount = ev.wheelDeltaY;
    if (amount < 0) 
      this.zoom(0.9, [ev.screenX / this.size[0], ev.screenY / this.size[1]]);
    else if (amount > 0) 
      this.zoom(1.1);
    this.force.start();
  }
});
elation.extend('network.host', function(parent, args) {
  this.args = args;

  this.init = function() {
    this.address = this.args.address;
    this.hostname = this.args.hostname;
    this.type = this.args.type;
    this.connections = []
    this.x = (parent.size[0] / 2) + (20 * (Math.random() - .5));
    this.y = (parent.size[1] / 2) + (20 * (Math.random() - .5));

    //parent.hostnodes.push(this);
  }
  this.connect = function(host) {
    this.connections.push(host);
  }
  this.disconnect = function(host) {
    var idx = this.connections.indexOf(host);
    if (idx != -1) {
      this.connections.splice(idx,1);
    }
    if (this.connections.length == 0) {
      var hostidx = parent.hostnodes.indexOf(this);
      console.log('disconnected last host:', this.hostname, this.address, hostidx);
      if (hostidx != -1) {
        //parent.hostnodes.splice(hostidx, 1);
      }
    }
  }
  this.init();
});
elation.extend('network.connection', function(parent, args) {
  this.args = args;

  this.init = function() {
    if (this.args.src && this.args.dst) {
      this.src = parent.gethost(this.args.src);
      this.dst = parent.gethost(this.args.dst);
      this.src.connect(this.dst.address);
      this.dst.connect(this.src.address);

      this.source = this.src;
      this.target = this.dst;
    }
  }
  this.close = function() {
    this.src.disconnect(this.dst.address);
    this.dst.disconnect(this.src.address);
  }
  this.init();
});
elation.extend('network.trace', function(parent, args) {
  this.init = function() {
    this.src = args.src;
    this.dst = args.dst;
    this.type = args.type || "udp";
    this.tracetime = args.tracetime || parent.tracetime;
    this.stopped = false;
    this.started = false;
  }
  this.poll = function() {
    if (!this.stopped) {
      // TODO - implement websocket streaming of this data
      this.started = true;
      setTimeout(elation.bind(this, this.poll), this.tracetime);
      var type = parent.tracetype.value || this.type;
      elation.ajax.Get('network/trace.js?host=' + this.dst + '&type=' + type, null, {
        callback: elation.bind(parent, function(d) { 
          var response = JSON.parse(d);
          if (response.data) this.mergedata(response.data); 
        })
      });
    }
  }
  this.init();
});
