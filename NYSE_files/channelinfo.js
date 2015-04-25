var yb={
  channels:{'CHANNEL_MONEY':'','CHANNEL_SPORTS':'','CHANNEL_LEISURE':'','CHANNEL_AUTOS':'','CHANNEL_CAREER_FAMILY':'','CHANNEL_HOMES':'','CHANNEL_SUNDAY_JOURNAL':'','CHANNEL_ECONOMY':'','CHANNEL_REVIEWS':'','CHANNEL_TRAVEL':'','CHANNEL_PERSONAL_JOURNAL':'','CHANNEL_TASTE':'','CHANNEL_WINE':'','CHANNEL_USNEWSBUSINESS':''},
  containsChannel:function(c){return (typeof this.channels[c]!='undefined');},
  init:function(){if(this.processed){return;}if(window.channels){for(c in channels){if(channels[c]&&this.containsChannel(c)){this.showBadge=true;break;}}this.processed=true;}},
  showBadge:false,
  processed:false
};
yb.init();
