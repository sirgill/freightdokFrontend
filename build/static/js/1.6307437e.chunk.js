(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[1],{1074:function(e,t,i){"use strict";var n=i(1034),a=i(233),c=i(1088),r=i.n(c),s=i(349),l=i(350),o=i(1087),d=i.n(o),j=i(476),u=i.n(j),p=i(1086),b=i.n(p),x=i(1016),O=i(103),h=i(1035),m=i(1060),f=i(351),g=i(360),v=i.n(g),k=i(528),y=i(65),C=i(33),A=i(4),D=i(5),S=i(11),w=i(1),z=i.n(w),_=i(59),L=i.n(_),I=i(1053),P=i(1050),N=i(35),T=i(106),F=i(172),W=i.n(F),R=i(235),M=i(1007),E=i(1049),Z=(i(1085),i(258)),B=i(154),H=Object(B.a)((function(e){return{root:{minWidth:200,maxWidth:350,marginBottom:10,backgroundColor:"#FFFFFF",borderRadius:5,borderWidth:1,borderStyle:"solid",borderColor:"grey"},cardcontent:{flexDirection:"row",wrap:"wrap",minWidth:100,maxWidth:150,paddingLeft:20,paddingTop:15,paddingBottom:5,"&:last-child":{paddingBottom:5}},pickup:{fontSize:12,alignItems:"center"},h4:{margin:0,padding:0},loadp:{display:"flex",margin:0,padding:0,paddingLeft:150,alignItems:"center"},playIcon:{height:38,width:30,marginLeft:0},textField:{"& input":{color:"#000000"},"& input:disabled":{color:"#000000"}},textFieldDialog:{"& input":{color:"#000000"},"& input:disabled":{color:"#000000"}},textFieldDialogPickup:{"& input":{color:"#000000"},"& input:disabled":{color:"#000000"},marginLeft:"75px"},textFieldDialogDrop:{"& input":{color:"#000000"},"& input:disabled":{color:"#000000"},marginLeft:"25px"},resize:{fontSize:13},resizeDialog:{fontSize:14},newLoad:{margin:0},paper:{position:"absolute",backgroundColor:e.palette.background.paper,boxShadow:e.shadows[5],padding:e.spacing(1,2,3),top:"50%",left:"50%",width:"80%",transform:"translate(-50%, -50%)",overflowY:"auto",maxHeight:"90%",outline:"none"},rootLoadDetailModal:{flexGrow:1,flexDirection:"row"},formControl:{margin:e.spacing(1),minWidth:120}}})),V=i(37),J=i(1018),G=i(1017),U=i(1020),Y=i(1019),q=i(63),K=i(42),Q=i(2),X={status:"",rate:"",assignedTo:null,trailorNumber:"",rateConfirmation:null,proofDelivery:null,accessorials:[],pickup:[],drop:[],invoice_created:!1},$={PaperProps:{style:{maxHeight:224,width:250}}},ee=function(e){var t=e.value;return t||"--"},te=function(e){var t=e.modalEdit,i=e.open,c=e.handleClose,o=e.listBarType,j=e.load,p=j||{},g=p._id,_=(p.brokerage,p.loadNumber),F=p.rate,B=p.trailorNumber,te=p.pickup,ie=p.drop,ne=(p.assignedTo,p.user),ae=p.status,ce=void 0===ae?"":ae,re=p.accessorials,se=void 0===re?[]:re,le=p.invoice_created,oe=p.bucketFiles,de=void 0===oe?[]:oe,je=L.a.cloneDeep(de),ue=H(),pe=Object(N.d)(),be=Object(N.e)((function(e){return e})),xe=z.a.useState(!0),Oe=Object(S.a)(xe,2),he=Oe[0],me=Oe[1],fe=z.a.useState(Object(D.a)({},X)),ge=Object(S.a)(fe,2),ve=ge[0],ke=ge[1],ye=Object(w.useState)(!1),Ce=Object(S.a)(ye,2),Ae=Ce[0],De=Ce[1],Se=Object(w.useRef)(),we=Object(w.useRef)(),ze=he?E.a:M.a,_e=be.driver.drivers.map((function(e){var t=e.user,i=(void 0===t?{}:t)||"",n=i.name,a=void 0===n?"":n,c=i._id;return{name:a,_id:void 0===c?"":c}})).filter((function(e){return!(null===e||void 0===e||!e._id)}))||[];Object(w.useEffect)((function(){Le(),ke({status:ce,assignedTo:ne,accessorials:se,trailorNumber:B,pickup:te,drop:ie,rate:F,loadNumber:_,invoice_created:le}),Re()}),[]),Object(w.useEffect)((function(){be.driver.drivers.length}),[be.driver.drivers]),Object(w.useEffect)((function(){be.load.error.msg||me(!1)}),[be.load.error]),Object(w.useEffect)((function(){t&&me(!0)}),[t]),Object(w.useEffect)((function(){be.load.load}),[be.load.load]);var Le=function(){pe(Object(R.d)())},Ie=function(e){De(!1),e&&c()},Pe=function(e){e.preventDefault(),"Empty"!==ve.status&&(ve.invoice_created=!1),De(!0),pe(Object(T.m)(Object(D.a)(Object(D.a)({},ve),{},{_id:g}),o,je,Ie))},Ne=function(e){var t=e.target,i=t.name,n=t.value;ke(Object(D.a)(Object(D.a)({},ve),{},Object(A.a)({},i,n)))},Te=function(e,t,i){var n=e.target.value;"pickup"===t?ke(Object(D.a)(Object(D.a)({},ve),{},{pickup:[Object(D.a)(Object(D.a)({},ve.pickup[0]),{},Object(A.a)({},i,n))]})):"drop"===t&&ke(Object(D.a)(Object(D.a)({},ve),{},{drop:[Object(D.a)(Object(D.a)({},ve.drop[0]),{},Object(A.a)({},i,n))]}))},Fe=function(e,t){ke(Object(D.a)(Object(D.a)({},ve),{},Object(A.a)({},t,[Object(D.a)(Object(D.a)({},ve[t][0]),{},Object(A.a)({},"".concat(t,"Date"),e))])))},We=function(e){var t=e.target,i=t.name,n=t.files;ke((function(e){return Object(D.a)(Object(D.a)({},e),{},Object(A.a)({},i,n||null))}))},Re=function(){Se.current&&(Se.current.value=""),we.current&&(we.current.value="")},Me=function(e,t,i){ke((function(n){return Object(D.a)(Object(D.a)({},n),{},Object(A.a)({},t,[Object(D.a)(Object(D.a)({},n[t][0]),{},Object(A.a)({},i,e))]))}))},Ee=function(){try{return be.auth.user.role}catch(e){return""}};if(de.length){var Ze=Object(C.a)(de);de={},Ze.forEach((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.fileType,i=void 0===t?"":t,n=e.fileLocation,a=void 0===n?"":n;Object.assign(de,Object(A.a)({},i,a))}))}else de={};var Be=de||{},He=Be.rateConfirmation,Ve=void 0===He?"":He,Je=Be.proofDelivery,Ge=void 0===Je?"":Je,Ue=function(e){var t=e.heading,i=e.values,n=void 0===i?[]:i,a=e.spacing,c=void 0===a?2:a,r=e.sxObject,s=void 0===r?{}:r;return Object(Q.jsxs)(k.a,{spacing:c,sx:Object(D.a)({},s),children:[Object(Q.jsx)(k.a,{children:Object(Q.jsx)(y.a,{sx:{fontWeight:600,fontSize:18,textAlign:"center"},children:t})}),n.map((function(e){return Object(Q.jsx)(k.a,{children:Object(Q.jsx)(ee,{value:e})})}))]})};return Object(Q.jsx)(Q.Fragment,{children:Object(Q.jsx)(n.a,{open:i,onClose:c,"aria-labelledby":"server-modal-title",children:Object(Q.jsxs)("div",{className:ue.paper,children:[Object(Q.jsx)(k.a,{direction:"row",justifyContent:"space-between",sx:{mb:2},children:Object(Q.jsx)(f.a,{children:Object(Q.jsx)(v.a,{id:"server-modal-title",onClick:c})})}),Object(Q.jsxs)("form",{onSubmit:Pe,children:[Object(Q.jsxs)(O.a,{container:!0,spacing:2,className:ue.rootLoadDetailModal,children:[Object(Q.jsx)(O.a,{item:!0,xs:12,children:Object(Q.jsxs)(O.a,{container:!0,className:ue.rootLoadDetailModal,spacing:2,sx:{pl:3,pr:3},children:[Object(Q.jsx)(O.a,{item:!0,xs:12,sm:4,children:Object(Q.jsxs)(I.a,{sx:{m:1},size:"small",fullWidth:!0,children:[Object(Q.jsx)(P.a,{id:"multiple-name",children:"Status"}),Object(Q.jsx)(h.a,{id:"multiple-name",name:"status",value:ve.status,onChange:function(e){var t=e.target.value;return ke(Object(D.a)(Object(D.a)({},ve),{},{status:t}))},input:Object(Q.jsx)(ze,{size:"small",label:"",notched:!1,sx:{}}),MenuProps:$,disabled:!he||"driver"===be.auth.user.role,children:[{id:"loadCheckIn",label:"Load Check-In"},{id:"pickupCompete",label:"Pickup Complete"},{id:"arrivedAtDelivery",label:"Arrived at Delivery"},{id:"arrivedAtPickup",label:"Arrived at Pickup"},{id:"delivered",label:"Delivered"},{id:"enRoute",label:"En Route to Delivery"}].map((function(e){return Object(Q.jsx)(m.a,{value:e.id,children:e.label},e.id)}))})]})}),Object(Q.jsx)(O.a,{item:!0,xs:12,sm:4,children:Object(Q.jsxs)(I.a,{sx:{m:1},size:"small",fullWidth:!0,children:[Object(Q.jsx)(P.a,{id:"multiple-name",children:"Assigned"}),Object(Q.jsx)(h.a,{id:"multiple-name",name:"assignedTo",disabled:!he||"driver"===be.auth.user.role,value:ve.assignedTo,onChange:function(e){var t=e.target.value;return ke(Object(D.a)(Object(D.a)({},ve),{},{assignedTo:t}))},input:Object(Q.jsx)(ze,{size:"small",label:"",notched:!1,sx:{}}),MenuProps:$,children:_e.map((function(e){return Object(Q.jsx)(m.a,{value:e._id,children:e.name},e.name)}))})]})}),Object(Q.jsxs)(O.a,{item:!0,xs:12,sm:4,children:[Object(Q.jsx)(P.a,{id:"demo-multiple-name-label",children:"Accessorials"}),Object(Q.jsx)(I.a,{sx:{m:0},fullWidth:!0,children:Object(Q.jsx)(h.a,{labelId:"demo-multiple-name-label",id:"demo-multiple-name",multiple:!0,value:ve.accessorials,onChange:function(e){var t=e.target.value;return ke(Object(D.a)(Object(D.a)({},ve),{},{accessorials:"string"===typeof t?t.split(","):t}))},input:Object(Q.jsx)(ze,{size:"small",label:"",notched:!1}),MenuProps:$,disabled:!he,children:[{id:"Tonu",label:"Tonu"},{id:"Detention",label:"Detention"},{id:"Lumper-by-Broker",label:"Lumper by Broker"},{id:"Lumper-by-Carrier",label:"Lumper by Carrier"},{id:"Layover",label:"Layover"}].map((function(e){return Object(Q.jsx)(m.a,{value:e.id,children:e.label},e.id)}))})})]})]})}),Object(Q.jsx)(O.a,{item:!0,xs:12,sx:{m:2},children:Object(Q.jsx)(x.a,{})})]}),Object(Q.jsxs)(O.a,{container:!0,children:[Object(Q.jsx)(O.a,{item:!0,xs:2,sx:{display:"flex"},children:Object(Q.jsxs)(l.a,{sx:{alignItems:"end",display:"flex"},children:[he?Object(Q.jsx)(f.a,{onClick:Pe,disabled:Ae,children:Object(Q.jsx)(b.a,{fontSize:"large",color:Ae?"disabled":"primary"})}):Object(Q.jsx)(f.a,{onClick:function(){return me(!0)},title:"Edit",disabled:Ae,children:Object(Q.jsx)(u.a,{fontSize:"large",color:Ae?"disabled":"primary"})}),he?Object(Q.jsx)(f.a,{onClick:function(){ke(Object(D.a)(Object(D.a)({},ve),{},{assignedTo:ne,status:ce,accessorials:se,pickup:te,drop:ie})),me(!1),Re()},disabled:Ae,children:Object(Q.jsx)(v.a,{fontSize:"large",color:Ae?"disabled":"primary"})}):Object(Q.jsx)(f.a,{onClick:function(){var e=Object(D.a)({},j);e=Object(Z.b)(e,"pickup","pickUp"),e=Object(Z.b)(e,"drop","dropOff"),De(!0),pe(Object(T.b)(e,Ie))},title:"Create Copy",disabled:Ae,children:Object(Q.jsx)(d.a,{fontSize:"large",color:Ae?"disabled":"primary"})})]})}),Object(Q.jsx)(O.a,{item:!0,xs:8,children:Object(Q.jsxs)(O.a,{container:!0,children:[Object(Q.jsx)(O.a,{xs:12,item:!0,display:"flex",justifyContent:"center",children:Object(Q.jsxs)(k.a,{children:[Object(Q.jsx)(k.a,{direction:"row",children:he?Ee()&&("admin"===Ee()||"dispatch"===Ee())&&Object(Q.jsx)(V.a,{labelStyle:{fontWeight:800,fontSize:18,color:"#03031A"},id:"outlined-basic",name:"loadNumber",value:ve.loadNumber,onChange:Ne,label:"Load",direction:"row"}):Object(Q.jsxs)(w.Fragment,{children:[Object(Q.jsx)(y.a,{sx:{mr:1,fontWeight:600,fontSize:18},children:"Load"}),Object(Q.jsx)(y.a,{item:!0,sx:{fontSize:18},children:_||"--"})]})}),Object(Q.jsx)(k.a,{direction:"row",children:he?Ee()&&("admin"===Ee()||"dispatch"===Ee())&&Object(Q.jsx)(V.a,{id:"outlined-basic",label:"Rate",name:"rate",value:ve.rate,onChange:Ne,direction:"row",labelStyle:{fontWeight:800,fontSize:18,color:"#03031A"}}):Object(Q.jsxs)(w.Fragment,{children:[Object(Q.jsx)(y.a,{sx:{mr:1,fontWeight:600,fontSize:18},children:"Rate"}),Object(Q.jsx)(y.a,{item:!0,sx:{fontSize:18},children:F||"--"})]})})]})}),Object(Q.jsx)(O.a,{item:!0,xs:12,children:Object(Q.jsxs)(O.a,{container:!0,children:[Object(Q.jsx)(O.a,{item:!0,xs:5,children:Object(Q.jsxs)(k.a,{sx:{textAlign:"center"},children:[Object(Q.jsx)(k.a,{children:he&&"driver"!==be.auth.user.role?Object(Q.jsxs)(k.a,{children:[Object(Q.jsx)(V.a,{id:"outlined-basic",placeholder:"Shipper Name",value:ve.pickup[0]?ve.pickup[0].shipperName:"",onChange:function(e){return Te(e,"pickup","shipperName")}}),Object(Q.jsx)(V.a,{id:"outlined-basic",variant:"outlined",placeholder:"Address",value:ve.pickup[0]?ve.pickup[0].pickupAddress:"",onChange:function(e){return Te(e,"pickup","pickupAddress")}}),he&&"driver"!==be.auth.user.role&&Object(Q.jsxs)(w.Fragment,{children:[Object(Q.jsx)(V.a,{id:"outlined-basic",variant:"outlined",placeholder:"City",value:ve.pickup[0]?ve.pickup[0].pickupCity:"",onChange:function(e){return Te(e,"pickup","pickupCity")}}),Object(Q.jsx)(V.a,{id:"outlined-basic",placeholder:"State",value:ve.pickup[0]?ve.pickup[0].pickupState:"",onChange:function(e){return Te(e,"pickup","pickupState")}}),Object(Q.jsx)(V.a,{id:"outlined-basic",variant:"outlined",placeholder:"Zip",value:ve.pickup[0]?ve.pickup[0].pickupZip:"",onChange:function(e){return Te(e,"pickup","pickupZip")}})]})]}):Object(Q.jsx)(Ue,{heading:"Pickup",values:[ve.pickup[0]?ve.pickup[0].pickupAddress:"",te&&te[0]?te[0].shipperName:"","".concat(te&&te[0]?te[0].pickupCity:"",", ").concat(te&&te[0]?te[0].pickupState:"",", ").concat(te&&te[0]?te[0].pickupZip:"")]})}),Object(Q.jsx)(k.a,{spacing:2,children:he?Object(Q.jsxs)(O.a,{container:!0,spacing:2,children:[Object(Q.jsx)(O.a,{item:!0,xs:12,children:Object(Q.jsx)(y.a,{sx:{fontWeight:600,fontSize:18,textAlign:"center"},children:"Pickup Time"})}),Object(Q.jsx)(O.a,{item:!0,xs:6,children:Object(Q.jsx)(G.a,{dateAdapter:J.a,children:Object(Q.jsx)(Y.a,{value:ve.pickup[0]?ve.pickup[0].pickupDate:"",onChange:function(e){return Fe(e,"pickup")},renderInput:function(e){return Object(Q.jsx)(s.a,Object(D.a)(Object(D.a)({},e),{},{variant:"standard"}))}})})}),Object(Q.jsx)(O.a,{item:!0,xs:6,children:Object(Q.jsx)(G.a,{dateAdapter:J.a,children:Object(Q.jsx)(U.a,{value:ve.pickup[0]?ve.pickup[0].pickupDate:"",onChange:function(e){return Fe(e,"pickup")},renderInput:function(e){return Object(Q.jsx)(s.a,Object(D.a)(Object(D.a)({},e),{},{variant:"standard"}))}})})}),Object(Q.jsx)(O.a,{item:!0,xs:6,children:Object(Q.jsx)(G.a,{dateAdapter:J.a,children:Object(Q.jsx)(U.a,{label:"In Time",value:ve.pickup[0]?ve.pickup[0].in_time:"",onChange:function(e){return Me(e,"pickup","in_time")},renderInput:function(e){return Object(Q.jsx)(s.a,Object(D.a)(Object(D.a)({},e),{},{variant:"standard"}))}})})}),Object(Q.jsx)(O.a,{item:!0,xs:6,children:Object(Q.jsx)(G.a,{dateAdapter:J.a,children:Object(Q.jsx)(U.a,{label:"Out Time",value:ve.pickup[0]?ve.pickup[0].out_time:"",onChange:function(e){return Me(e,"pickup","out_time")},renderInput:function(e){return Object(Q.jsx)(s.a,Object(D.a)(Object(D.a)({},e),{},{variant:"standard"}))}})})})]}):Object(Q.jsxs)(w.Fragment,{children:[Object(Q.jsx)(Ue,{spacing:2,sxObject:{mt:2},heading:"Pickup Time",values:[te&&te[0]?W()(te[0].pickupDate).format("LLL"):""]}),Object(Q.jsxs)(k.a,{direction:"row",justifyContent:"space-evenly",spacing:2,children:[Object(Q.jsx)(k.a,{children:te&&te[0]&&te[0].in_time?Object(Q.jsxs)(k.a,{sx:{textAlign:"left"},children:[Object(Q.jsx)(y.a,{variant:"inherit",sx:{color:"#8898AA",fontSize:10},children:"In Time: "}),Object(Q.jsx)(l.a,{children:W()(te[0].in_time).format("h:mm A")})]}):"--"}),Object(Q.jsx)(k.a,{children:te&&te[0]&&te[0].out_time?Object(Q.jsxs)(k.a,{sx:{textAlign:"left"},children:[Object(Q.jsx)(y.a,{variant:"inherit",sx:{color:"#8898AA",fontSize:10},children:"Out Time:"}),Object(Q.jsx)(l.a,{children:W()(te[0].out_time).format("h:mm A")})]}):"--"})]})]})}),Object(Q.jsx)(k.a,{spacing:2,children:Object(Q.jsxs)(O.a,{item:!0,xs:12,style:{textAlign:"left",width:"100%"},children:[Object(Q.jsxs)(k.a,{spacing:2,sx:{mt:2,mb:2},children:[Object(Q.jsxs)(k.a,{direction:"row",alignItems:"center",spacing:1,children:[Object(Q.jsx)(y.a,{fontWeight:700,children:"PO#"}),he?Object(Q.jsx)(V.a,{value:ve&&ve.pickup[0]?ve.pickup[0].pickupPo:"",onChange:function(e){return Te(e,"pickup","pickupPo")}}):Object(Q.jsx)(y.a,{children:te&&te[0]?te[0].pickupPo:""})]}),Object(Q.jsxs)(k.a,{direction:"row",alignItems:"center",spacing:1,children:[Object(Q.jsx)(y.a,{fontWeight:700,children:"Reference#"}),he?Object(Q.jsx)(V.a,{value:te&&ve.pickup[0]?ve.pickup[0].pickupReference:"",onChange:function(e){return Te(e,"pickup","pickupReference")}}):Object(Q.jsx)(y.a,{children:te&&te[0]?te[0].pickupReference:""})]}),Object(Q.jsxs)(k.a,{direction:"row",alignItems:"center",spacing:1,children:[Object(Q.jsx)(y.a,{fontWeight:700,children:"Delivery#"}),he?Object(Q.jsx)(V.a,{value:te&&ve.pickup[0]?ve.pickup[0].pickupDeliverNumber:"",onChange:function(e){return Te(e,"pickup","pickupDeliverNumber")}}):Object(Q.jsx)(y.a,{children:te&&te[0]?te[0].pickupDeliverNumber:""})]})]}),"driver"!==be.auth.user.role&&Object(Q.jsx)(V.a,{id:"outlined-multiline-static",placeholder:"Pickup Notes",multiline:!0,rows:2,type:"textarea",value:ve.pickup[0]?ve.pickup[0].notes:"",onChange:function(e){return Te(e,"pickup","notes")},variant:"outlined",readOnly:!he})]})})]})}),Object(Q.jsx)(O.a,{item:!0,xs:2,sx:{display:"flex",alignItem:"center",mt:5},children:Object(Q.jsx)(r.a,{style:{color:q.b,marginTop:"13%",margin:"0 auto",height:40,width:40}})}),Object(Q.jsxs)(O.a,{item:!0,xs:5,children:[Object(Q.jsx)(k.a,{sx:{textAlign:"center"},children:he?"driver"!==be.auth.user.role&&Object(Q.jsxs)(w.Fragment,{children:[Object(Q.jsx)(V.a,{id:"outlined-basic",variant:"outlined",placeholder:"Receiver Name",value:ve.drop[0]?ve.drop[0].receiverName:"",onChange:function(e){return Te(e,"drop","receiverName")}}),Object(Q.jsx)(V.a,{id:"outlined-basic",variant:"outlined",placeholder:"Address",value:ve.drop[0]?ve.drop[0].dropAddress:"",onChange:function(e){return Te(e,"drop","dropAddress")}}),Object(Q.jsx)(V.a,{id:"outlined-basic",variant:"outlined",placeholder:"City",value:ve.drop[0]?ve.drop[0].dropCity:"",onChange:function(e){return Te(e,"drop","dropCity")}}),Object(Q.jsx)(V.a,{id:"outlined-basic",variant:"outlined",placeholder:"State",value:ve.drop[0]?ve.drop[0].dropState:"",onChange:function(e){return Te(e,"drop","dropState")}}),Object(Q.jsx)(V.a,{id:"outlined-basic",variant:"outlined",placeholder:"Zip",value:ve.drop[0]?ve.drop[0].dropZip:"",onChange:function(e){return Te(e,"drop","dropZip")}})]}):Object(Q.jsx)(Ue,{heading:"Drop",values:[ie&&ie[0]?ie[0].receiverName:"",ve.drop[0]?ve.drop[0].dropAddress:"","".concat(ie&&ie[0]?ie[0].dropCity:"",",\n                                    ").concat(ie&&ie[0]?ie[0].dropState:"",",\n                                    ").concat(ie&&ie[0]?ie[0].dropZip:"")]})}),Object(Q.jsx)(k.a,{spacing:2,sx:{textAlign:"center"},children:he?Object(Q.jsxs)(O.a,{container:!0,spacing:2,children:[Object(Q.jsx)(O.a,{item:!0,xs:12,children:Object(Q.jsx)(y.a,{sx:{fontWeight:600,fontSize:18,textAlign:"center"},children:"Drop Time"})}),Object(Q.jsx)(O.a,{item:!0,xs:6,children:Object(Q.jsx)(G.a,{dateAdapter:J.a,children:Object(Q.jsx)(Y.a,{value:ve.drop[0]?ve.drop[0].dropDate:"",onChange:function(e){return Fe(e,"drop")},renderInput:function(e){return Object(Q.jsx)(s.a,Object(D.a)(Object(D.a)({},e),{},{variant:"standard"}))}})})}),Object(Q.jsx)(O.a,{item:!0,xs:6,children:Object(Q.jsx)(G.a,{dateAdapter:J.a,children:Object(Q.jsx)(U.a,{value:ve.drop[0]?ve.drop[0].dropDate:"",onChange:function(e){return Fe(e,"drop")},renderInput:function(e){return Object(Q.jsx)(s.a,Object(D.a)(Object(D.a)({},e),{},{variant:"standard"}))}})})}),Object(Q.jsx)(O.a,{item:!0,xs:6,children:Object(Q.jsx)(G.a,{dateAdapter:J.a,children:Object(Q.jsx)(U.a,{label:"In Time",value:ve.drop[0]?ve.drop[0].in_time:"",onChange:function(e){return Me(e,"drop","in_time")},renderInput:function(e){return Object(Q.jsx)(s.a,Object(D.a)(Object(D.a)({},e),{},{variant:"standard"}))}})})}),Object(Q.jsx)(O.a,{item:!0,xs:6,children:Object(Q.jsx)(G.a,{dateAdapter:J.a,children:Object(Q.jsx)(U.a,{label:"Out Time",value:ve.drop[0]?ve.drop[0].out_time:"",onChange:function(e){return Me(e,"drop","out_time")},renderInput:function(e){return Object(Q.jsx)(s.a,Object(D.a)(Object(D.a)({},e),{},{variant:"standard"}))}})})})]}):Object(Q.jsxs)(w.Fragment,{children:[Object(Q.jsx)(Ue,{spacing:2,sxObject:{mt:2},heading:"Drop Time",values:[ie&&ie[0]?W()(ie[0].dropDate).format("LLL"):""]}),Object(Q.jsxs)(k.a,{direction:"row",justifyContent:"space-evenly",spacing:1,children:[Object(Q.jsx)(k.a,{children:ie&&ie[0]&&ie[0].in_time?Object(Q.jsxs)(k.a,{sx:{textAlign:"left"},children:[Object(Q.jsx)(y.a,{variant:"inherit",sx:{color:"#8898AA",fontSize:10},children:"In Time: "}),Object(Q.jsx)(l.a,{children:W()(ie[0].in_time).format("h:mm A")})]}):"--"}),Object(Q.jsx)(k.a,{children:ie&&ie[0]&&ie[0].out_time?Object(Q.jsxs)(k.a,{sx:{textAlign:"left"},children:[Object(Q.jsx)(y.a,{variant:"inherit",sx:{color:"#8898AA",fontSize:10},children:"Out Time: "}),Object(Q.jsx)(l.a,{children:W()(ie[0].out_time).format("h:mm A")})]}):"--"})]})]})}),Object(Q.jsxs)(O.a,{item:!0,xs:12,sx:{textAlign:"left",mt:1},children:[Object(Q.jsxs)(k.a,{spacing:2,sx:{mt:2,mb:2},children:[Object(Q.jsxs)(k.a,{direction:"row",alignItems:"center",spacing:1,children:[Object(Q.jsx)(y.a,{fontWeight:700,children:"PO#"}),he?Object(Q.jsx)(V.a,{dropPo:"dropPo",value:ve&&ve.drop[0]?ve.drop[0].dropPo:"",onChange:function(e){return Te(e,"drop","dropPo")}}):Object(Q.jsx)(y.a,{children:ie&&ie[0]?ie[0].dropPo:""})]}),Object(Q.jsxs)(k.a,{direction:"row",alignItems:"center",spacing:1,children:[Object(Q.jsx)(y.a,{fontWeight:700,children:"Reference# "}),he?Object(Q.jsx)(V.a,{value:ve&&ve.drop[0]?ve.drop[0].dropReference:"",onChange:function(e){return Te(e,"drop","dropReference")}}):Object(Q.jsx)(y.a,{children:ie&&ie[0]?ie[0].dropReference:""})]}),Object(Q.jsxs)(k.a,{direction:"row",alignItems:"center",spacing:1,children:[Object(Q.jsx)(y.a,{fontWeight:700,children:"Deliver# "}),he?Object(Q.jsx)(V.a,{value:ve&&ve.drop[0]?ve.drop[0].dropDeliverNumber:"",onChange:function(e){return Te(e,"drop","dropDeliverNumber")}}):Object(Q.jsx)(y.a,{children:ie&&ie[0]?ie[0].dropDeliverNumber:""})]})]}),"driver"!==be.auth.user.role&&Object(Q.jsx)(V.a,{id:"outlined-multiline-static",placeholder:"Drop Notes",multiline:!0,rows:2,type:"textarea",value:ve.drop[0]?ve.drop[0].notes:"",onChange:function(e){return Te(e,"drop","notes")},variant:"outlined",readOnly:!he})]})]})]})})]})}),Object(Q.jsx)(O.a,{item:!0,xs:2,sx:{display:"flex",alignItems:"end",justifyContent:"flex-end"},children:Object(Q.jsxs)(k.a,{spacing:2,sx:{alignItems:"end"},children:[Object(Q.jsxs)(k.a,{style:{margin:0},direction:"row",spacing:2,children:[Ve?Object(Q.jsx)("span",{children:Object(Q.jsx)("a",{href:Ve,target:"_blank",children:"Rate Con"})}):Object(Q.jsx)("span",{children:"Rate Con"}),Object(Q.jsx)("span",{children:he?Object(Q.jsx)(w.Fragment,{children:Object(Q.jsxs)("label",{htmlFor:"contained-button-file1",children:[Object(Q.jsx)("input",{style:{display:"none"},type:"file",multiple:!0,name:"rateConfirmation",disabled:!he||"driver"===be.auth.user.role,onChange:We,ref:Se,id:"contained-button-file1"}),Object(Q.jsx)(a.a,{variant:"outlined",component:"span",size:"small",children:"Attach"})]})}):Object(K.c)(!!Ve)})]}),Object(Q.jsxs)(k.a,{style:{margin:0},direction:"row",spacing:2,children:[Ge?Object(Q.jsx)("span",{children:Object(Q.jsx)("a",{href:Ge,target:"_blank",children:"POD"})}):Object(Q.jsx)("span",{children:"POD"}),Object(Q.jsx)("span",{children:he?Object(Q.jsxs)("label",{htmlFor:"contained-button-file2",children:[Object(Q.jsx)("input",{style:{display:"none"},type:"file",multiple:!0,name:"proofDelivery",disabled:!he,onChange:We,ref:we,id:"contained-button-file2"}),Object(Q.jsx)(a.a,{variant:"outlined",component:"span",size:"small",children:"Attach"})]}):Object(K.c)(!!Ge)})]}),Object(Q.jsxs)(k.a,{style:{margin:0},direction:"row",spacing:2,children:[se.length?Object(Q.jsx)("span",{children:Object(Q.jsx)("a",{href:"#",target:"_blank",children:"Accessorials"})}):Object(Q.jsx)("span",{children:"Accessorials"}),Object(Q.jsx)("span",{children:he?Object(Q.jsx)(w.Fragment,{children:Object(Q.jsxs)("label",{htmlFor:"contained-button-file3",children:[Object(Q.jsx)("input",{style:{display:"none"},type:"file",multiple:!0,name:"accessorials",disabled:!he||"driver"===be.auth.user.role,onChange:We,ref:Se,id:"contained-button-file3"}),Object(Q.jsx)(a.a,{variant:"outlined",component:"span",size:"small",children:"Attach"})]})}):Object(K.c)(!(null===se||void 0===se||!se.length))})]})]})})]}),Object(Q.jsxs)(O.a,{container:!0,spacing:2,className:ue.rootLoadDetailModal,style:{marginTop:10},children:[Object(Q.jsx)(O.a,{item:!0,xs:1}),Object(Q.jsx)(O.a,{item:!0,xs:4,justifyContent:"center",sx:{textAlign:"center"}}),Object(Q.jsx)(O.a,{item:!0,xs:2,justifyContent:"center",display:"flex"}),Object(Q.jsx)(O.a,{item:!0,xs:4,style:{textAlign:"center"}}),Object(Q.jsx)(O.a,{item:!0,xs:1})]})]})]})})})};t.a=z.a.memo(te,(function(){return!0}))},1085:function(e,t,i){},1086:function(e,t,i){"use strict";var n=i(13);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=n(i(76)),c=i(2),r=(0,a.default)((0,c.jsx)("path",{d:"M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"}),"Done");t.default=r},1087:function(e,t,i){"use strict";var n=i(13);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=n(i(76)),c=i(2),r=(0,a.default)((0,c.jsx)("path",{d:"M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z"}),"FileCopyOutlined");t.default=r},1088:function(e,t,i){"use strict";var n=i(13);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=n(i(76)),c=i(2),r=(0,a.default)((0,c.jsx)("path",{d:"M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z"}),"ArrowForwardIos");t.default=r}}]);
//# sourceMappingURL=1.6307437e.chunk.js.map