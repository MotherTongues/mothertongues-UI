"use strict";(self.webpackChunkmtd_mobile_ui=self.webpackChunkmtd_mobile_ui||[]).push([[1061],{1061:(T,l,i)=>{i.r(l),i.d(l,{BookmarksPageModule:()=>x});var c=i(6814),u=i(95),s=i(5548),m=i(9792),k=i(236),o=i(6689),d=i(8044);function g(t,e){1&t&&o._UZ(0,"ion-icon",11)}function _(t,e){1&t&&(o.TgZ(0,"span"),o._uU(1,"cancel"),o.qZA())}function f(t,e){if(1&t){const n=o.EpF();o.TgZ(0,"ion-button",9),o.NdJ("click",function(){o.CHM(n);const r=o.oxw(2);return o.KtG(r.edit=!r.edit)}),o.YNc(1,g,1,0,"ion-icon",10),o.YNc(2,_,2,0,"span",6),o.qZA()}if(2&t){const n=o.oxw(2);o.xp6(1),o.Q6J("ngIf",!n.edit),o.xp6(1),o.Q6J("ngIf",n.edit)}}function p(t,e){if(1&t&&(o.TgZ(0,"ion-buttons",7),o.YNc(1,f,3,2,"ion-button",8),o.qZA()),2&t){const n=e.ngIf;o.xp6(1),o.Q6J("ngIf",n.length>0)}}function b(t,e){if(1&t){const n=o.EpF();o.TgZ(0,"ion-button",15),o.NdJ("click",function(){o.CHM(n);const r=o.oxw(2);return o.KtG(r.removeEntries())}),o._uU(1,"Remove selected bookmarks"),o.qZA()}}function v(t,e){if(1&t&&(o.TgZ(0,"div"),o._UZ(1,"mtd-entry-list",12),o.TgZ(2,"div",13),o.YNc(3,b,2,0,"ion-button",14),o.qZA()()),2&t){const n=e.ngIf,a=o.oxw();o.xp6(1),o.Q6J("entries",n)("parentEdit",a.edit),o.xp6(2),o.Q6J("ngIf",a.edit)}}const B=[{path:"",component:(()=>{class t{constructor(n){this.dataService=n,this.edit=!1}ngOnInit(){this.$bookmarks=this.dataService.$bookmarks}removeEntries(){}}return t.\u0275fac=function(n){return new(n||t)(o.Y36(k.D))},t.\u0275cmp=o.Xpm({type:t,selectors:[["mtd-bookmarks"]],decls:15,vars:8,consts:[[3,"translucent"],["slot","start"],["slot","end",4,"ngIf"],[3,"fullscreen"],["collapse","condense"],["size","large"],[4,"ngIf"],["slot","end"],["ion-button","",3,"click",4,"ngIf"],["ion-button","",3,"click"],["name","trash",4,"ngIf"],["name","trash"],[3,"entries","parentEdit"],[1,"center"],["color","danger","class","remove",3,"click",4,"ngIf"],["color","danger",1,"remove",3,"click"]],template:function(n,a){1&n&&(o.TgZ(0,"ion-header",0)(1,"ion-toolbar")(2,"ion-buttons",1),o._UZ(3,"ion-menu-button"),o.qZA(),o.TgZ(4,"ion-title"),o._uU(5,"Bookmarks"),o.qZA(),o.YNc(6,p,2,1,"ion-buttons",2),o.ALo(7,"async"),o.qZA()(),o.TgZ(8,"ion-content",3)(9,"ion-header",4)(10,"ion-toolbar")(11,"ion-title",5),o._uU(12,"bookmarks"),o.qZA()()(),o.YNc(13,v,4,3,"div",6),o.ALo(14,"async"),o.qZA()),2&n&&(o.Q6J("translucent",!0),o.xp6(6),o.Q6J("ngIf",o.lcZ(7,4,a.$bookmarks)),o.xp6(2),o.Q6J("fullscreen",!0),o.xp6(5),o.Q6J("ngIf",o.lcZ(14,6,a.$bookmarks)))},dependencies:[c.O5,s.YG,s.Sm,s.W2,s.Gu,s.gu,s.fG,s.wd,s.sr,d.l,c.Ov],styles:[".remove[_ngcontent-%COMP%]{bottom:0;position:fixed;width:100%}"]}),t})()}];let Z=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=o.oAB({type:t}),t.\u0275inj=o.cJS({imports:[m.Bz.forChild(B),m.Bz]}),t})();var P=i(4515);let x=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=o.oAB({type:t}),t.\u0275inj=o.cJS({imports:[c.ez,u.u5,s.Pc,Z,P.m]}),t})()}}]);