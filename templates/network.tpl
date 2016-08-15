{dependency name="ui.treeview"}
{dependency name="ui.select"}
{dependency name="utils.dust"}
{dependency name="utils.template"}
{dependency name="network"}
{dependency name="network.d3"}
{dependency name="network.traffic"}

<div data-elation-component="network.explore">
  <data class="elation-args">{jsonencode var=$data}</data>
</div>
<div data-elation-component="network.traffic">
  <data class="elation-args" name="addresses">{jsonencode var=$data.device->addresses}</data>
</div>
