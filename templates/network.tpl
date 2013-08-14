{dependency name="utils.dust"}
{dependency name="utils.template"}
{dependency name="network"}
{dependency name="network.d3"}
{dependency name="network.traffic"}

<div elation:component="network.explore">
  <elation:args>{jsonencode var=$data}</elation:args>
</div>
<div elation:component="network.traffic">
</div>
