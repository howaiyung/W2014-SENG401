/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  * [list]
  * 
  * Authors
  * 
  * - Davide Zerbetto (davide.zerbetto@eng.it)
  */

Ext.ns("Sbi.registry");

Sbi.registry.RegistryEditorGridPanel = function(config) {
	
	var defaultSettings = {
	};
			
	if(Sbi.settings && Sbi.settings.registry && Sbi.settings.registry.registryEditorGridPanel) {
		defaultSettings = Ext.apply(defaultSettings, Sbi.settings.registry.registryEditorGridPanel);
	}
			
	var c = Ext.apply(defaultSettings, config || {});
	
	Ext.apply(this, c);
	
	this.services = this.services || new Array();	
	this.services['load'] = this.services['load'] || Sbi.config.serviceRegistry.getServiceUrl({
		serviceName: 'LOAD_REGISTRY_ACTION'
		, baseParams: new Object()
	});
	this.services['getFieldDistinctValues'] = this.services['getFieldDistinctValues'] || Sbi.config.serviceRegistry.getServiceUrl({
		serviceName: 'GET_FILTER_VALUES_ACTION'
		, baseParams: new Object()
	});
	this.services['update'] = this.services['update'] || Sbi.config.serviceRegistry.getServiceUrl({
		serviceName: 'UPDATE_RECORDS_ACTION'
		, baseParams: new Object()
	});
	this.services['delete'] = this.services['delete'] || Sbi.config.serviceRegistry.getServiceUrl({
		serviceName: 'DELETE_RECORDS_ACTION'
		, baseParams: new Object()
	});
	
	
	this.init();
	

	
	this.pagingTBar = new Ext.PagingToolbar({
        pageSize: this.pageSize,
        store: this.store,
        displayInfo: true,
//        displayMsg: LN('sbi.qbe.datastorepanel.grid.displaymsg'),
//        emptyMsg: LN('sbi.qbe.datastorepanel.grid.emptymsg'),
//        beforePageText: LN('sbi.qbe.datastorepanel.grid.beforepagetext'),
//        afterPageText: LN('sbi.qbe.datastorepanel.grid.afterpagetext'),
//        firstText: LN('sbi.qbe.datastorepanel.grid.firsttext'),
//        prevText: LN('sbi.qbe.datastorepanel.grid.prevtext'),
//        nextText: LN('sbi.qbe.datastorepanel.grid.nexttext'),
//        lastText: LN('sbi.qbe.datastorepanel.grid.lasttext'),
//        refreshText: LN('sbi.qbe.datastorepanel.grid.refreshtext'),
        prependButtons: true
    });
	this.pagingTBar.on('render', function() {
	}, this);
	
	this.pagingTBar.on('beforechange', function(cont, params) {
		var filtersValuesObject = this.getFiltersValues();
		
		this.start = params.start;
		this.limit = params.limit;
	
		Ext.apply(params, filtersValuesObject);
	}, this);

	
	var initialColumnModel = new Ext.grid.ColumnModel({
		columns:[
		new Ext.grid.RowNumberer(), 
		{
			header: "Data",
			dataIndex: 'data',
			width: 75
		}
		]

	});
	
	c = Ext.apply(c, {
		//height : 500
		autoScroll : true
    	, store : this.store
    	, tbar : this.gridToolbar
        , cm : initialColumnModel
        , clicksToEdit : 1
        , style : 'padding:10px'
        , frame : true
        , border : true
        , collapsible : false
        , loadMask : true
        , enableHdMenu : false ///set true to eneable drob down menu on the header (which causes the loss of mouse control for resize column....)
        , viewConfig : {
            forceFit : false
            , autoFill : true
            , enableRowBody : true
        }
		, bbar: this.pagingTBar
		, meta: null
		,listeners: {headerdblclick : function( grid, columnIndex, e ){
			this.showExpandPointer(grid, columnIndex);
		}
		} 
	});
	
	// constructor
	Sbi.formviewer.DataStorePanel.superclass.constructor.call(this, c);
};

Ext.extend(Sbi.registry.RegistryEditorGridPanel, Ext.grid.EditorGridPanel, {
    
    services: null
	, store: null
	, registryConfiguration : null
	, driversValues : null
	, gridToolbar : null
	, filters : null
	, columnName2columnHeader : null
	, columnHeader2columnName : null
	, keyUpTimeoutId : null
	, mandatory: null
	, visibleColumns: []
	, columnsMaxSize: 15
	, pagingTBar: null
	, pageSize: 15
	, oldColumns: null
	, deletedRows: null
	, limit: null
	, start: null
    
	// ---------------------------------------------------------------------------------------------------
    // public methods
	// ---------------------------------------------------------------------------------------------------
	,renderTooltip:function(val, cell, record) {
		 
		// get data
		var data = record.data;
		 
		// return markup
		return '<div ext:qtip="' + val +'" ext:qtitle="Valore:" ext:qwidth="300" ext:qdismissDelay="0" ext:closable="true">' + val + '</div>';
		
	},
	showExpandPointer: function(grid, columnIndex){
		grid.getColumnModel().setColumnWidth( columnIndex, this.columnsMaxSize, false ) 
	}
	,
	load:  function(requestParameters) {
		this.firstPage= true;
		requestParameters.start = 0;
		requestParameters.limit = this.pageSize;
		this.store.load({params: requestParameters});
	}
	,
	loadFrom:  function(requestParameters) {
		if(requestParameters.start && requestParameters.start!= null && requestParameters.start==0){
			this.firstPage= true;			
		}
		if(!requestParameters.start || requestParameters.start == null) requestParameters.start = 0;
		if(!requestParameters.limit || requestParameters.limit == null) requestParameters.limit = this.pageSize;

		this.store.load({params: requestParameters});
	}
  	
	// ---------------------------------------------------------------------------------------------------
	// private methods
	// ---------------------------------------------------------------------------------------------------
	
	,
	init : function () {
		this.initStore();
		
//		this.on('sortchange', function(context, sortInfo){
//			var c = 0;
//		});
		
		this.initToolbar();
		Ext.QuickTips.init() ;
		Ext.apply(Ext.QuickTips.getQuickTip(), {
		    maxWidth: 200,
		    minWidth: 100,
		    showDelay: 50,
		    dismissDelay: 0,
		    closable: true,
		    title: 'Valore',
		    trackMouse: true
		});

	}

	,
	initStore: function() {
		
		var proxy = new Ext.data.HttpProxy({
	           url: this.services['load']
	           , timeout : 300000
	   		   , failure: this.onDataStoreLoadException
	    });
		
		this.store = new Ext.data.Store({
	        proxy: proxy,
	        reader: new Ext.data.JsonReader(
	        ),
	        remoteSort: true
	    });
			
		this.store.on('load', function(store, records, options ){
			var numRec = this.store.getCount();
			
			//redefines the columns labels if they are dynamics
			var tmpMeta = this.getColumnModel();
			var fields = tmpMeta.config;
			var metaIsChanged = false;
			var fieldsMap = {};
			tmpMeta.fields = new Array(fields.length);

			for(var i = 0, len = fields.length; i < len; i++) {				
				
				for(k=0; k<numRec; k++){
					var tmpRec = this.store.getAt(k);
					if (tmpRec !== undefined) {
						
						var valorig =  tmpRec.json[fields[i].header];

						
						if(fields[i].type === 'int'){	
						
					    	if (valorig !== undefined){	
					    		if(valorig === ''){
					    			tmpRec.data[fields[i].header] = valorig;
					    			tmpRec.commit();
					    		}
					    		if(valorig === '0'){
					    			tmpRec.data[fields[i].header] = '0';
					    			tmpRec.commit();
					    		}
					    		
					    	}
						}
					}
			    }
			}
		
		
		
		}, this);
		
//		this.store.on('add', function(store, records, options ){
//			var numRec = this.store.getCount();
//			
//			//redefines the columns labels if they are dynamics
//			var tmpMeta = this.getColumnModel();
//			var fields = tmpMeta.config;
//			var metaIsChanged = false;
//			var fieldsMap = {};
//			tmpMeta.fields = new Array(fields.length);
//
//			for(var i = 0, len = fields.length; i < len; i++) {				
//				
//				for(k=0; k<numRec; k++){
//					var tmpRec = this.store.getAt(k);
//					if (tmpRec !== undefined) {
//						
//						var valorig;
//						if(tmpRec.json != undefined){
//							valorig	=  tmpRec.json[fields[i].header];
//						}
//						
//						if(fields[i].type === 'int'){	
//						
//					    	if (valorig !== undefined){	
//					    		if(valorig === ''){
//					    			tmpRec.data[fields[i].header] = valorig;
//					    			tmpRec.commit();
//					    		}
//					    		if(valorig === '0'){
//					    			tmpRec.data[fields[i].header] = '0';
//					    			tmpRec.commit();
//					    		}
//					    		
//					    	}
//						}
//					}
//			    }
//			}
//		}, this);
		
		
		
		
		
		
	

		
		this.store.on('metachange', function( store, meta ) {
			
			this.visibleColumns = [];
			
			this.meta = meta;
			
			
			// ORDER
			//The following code is used for keep the order of the columns after the execution of the query 
			meta.fields[0] = new Ext.grid.RowNumberer();
			this.alias2FieldMetaMap = {};
			var fields = meta.fields;
			var newColumns = new Array();
			newColumns.length = fields.length;
			
			
			//1) first of all we check if the list of fields is changed 
			if(this.firstPage){
				for(var i = 0; i <meta.fields.length ;i++) {
					if(meta.fields[i].header){
					newColumns[i]= meta.fields[i].header;
					}
				}	
			}
			
			var val=true;
			if(this.oldColumns != null){
				if(this.oldColumns.length != newColumns.length){
					val=false;
				}else{
					for(var i = 1; i <this.oldColumns.length ;i++) {
						val = val && (this.oldColumns[i]==newColumns[i]);
					}	
				}
			}
			
			//2) if the list of fields is changed we should reload the columnsPosition and columnsWidth arrays
			if(this.oldColumns != null && this.firstPage && !val){

				
				
//				Suppose the columns in the select clause before the re executions are
//				A B C D E . After some operation the visualization in the data store panel is C B E D A
//				So we have the following arrays
//				oldColumns = A B C D E  
//				columnsPosition= 4 1 0 3 2
//				Now suppose the new fields are: A X D K. 
//				The new visualization should keeps the order and so should look like D A X K

				
//				The first step is calculate the array fieldsOrder that maps the new fields in the oldColumns array:
//				fieldsOrder: 0, , 3,    : A live in the position 0 in oldColumns, D in position 3, and the new fields have no position.

				var filedsOrder = new Array();
				var name;
				filedsOrder.length = fields.length;
				for(var i = 0; i <fields.length ;i++) {
					name = fields[i].header;
					for(var j = 0; j < this.oldColumns.length; j++) {
						if(name == this.oldColumns[j]){
							filedsOrder[i] = j;
							this.oldColumns[j]="";
							break;
						}			   
					}
				}

				
//				Now we change the indexes in fieldsOrder with previous position of the linked element. 
//				In code fieldsOrder[i] = columnsPosition[fieldsOrder[i]] and fieldsOrder: 4, , 3,    
//				Clean the array fieldsOrder filtering the empty spaces. 
//				The result is saved in the array cleanFreshPos = 4,3.

				
				var cleanFreshPos = new Array();
				var sortedCleanFreshPos = new Array();
				for(var i = 0; i <filedsOrder.length ;i++) {
					if(filedsOrder[i]!=null){
						cleanFreshPos.push(this.columnsPosition[filedsOrder[i]]);
						sortedCleanFreshPos.push(this.columnsPosition[filedsOrder[i]]);
						filedsOrder[i]=this.columnsPosition[filedsOrder[i]];
					}
				}
				
				var width = new Array();
				width.length = filedsOrder.length;

				sortedCleanFreshPos.sort();

//				Normalize the array cleanFreshPos: force the indexes to be an enumeration between 1 to cleanFreshPos.length. 
//				So normalizedCleanFreshPos = 2,1
//				We have to normalize the array because these values are the new position of the linked elements. 
				
				var normalizedCleanFreshPos = new Array();
				normalizedCleanFreshPos.length = sortedCleanFreshPos.length;

				for(var j = 0; j <cleanFreshPos.length ;j++) {
					for(var y=0; y<sortedCleanFreshPos.length; y++){
						if(sortedCleanFreshPos[y]==cleanFreshPos[j]){
							normalizedCleanFreshPos[j]=y+1;
							break;
						}
					}
				}
				
				
//				At the end we create the new array columnsPosition.
//				We take the fields we have also in the previous query and we save them at the beginning (with the normalizedCleanFreshPos array) 
//				of the array columnsPosition. 
//				Than we push the new fields in the tail of the array. 

				
				this.columnsPosition = new Array();
				this.columnsPosition.length = filedsOrder.length;
				this.columnsPosition[0]=0;//the position 0 is for the column with the row indexes
				
				var k=1;
				var m=0;
				for(var i = 1; i <filedsOrder.length ;i++) {
					if(filedsOrder[i]==null){//new fields
						this.columnsPosition[i]=k+cleanFreshPos.length;//in the tail
						width[k+cleanFreshPos.length] = 100;
						k++;
					}else{//old fields
						for(var j = 0; j <cleanFreshPos.length ;j++) {
							if(cleanFreshPos[j]==filedsOrder[i]){
								this.columnsPosition[i]=normalizedCleanFreshPos[m];
								width[normalizedCleanFreshPos[m]]=this.columnsWidth[filedsOrder[i]];
								m++;
							}
						}
					}
				}
				this.oldColumns=null;
				this.columnsWidth = width;
			}
			
			
			   // ORDER
			   
			// insert actual fields into oldCOlumns for next iteration
			   if(this.oldColumns == null){
					this.oldColumns = new Array();
					for(var i = 0; i <meta.fields.length ;i++) {
						this.oldColumns[i]= meta.fields[i].header;
					}
				}
			   
			   
			   // reassign meta.fields as stored in column Position
			   if(this.columnsPosition!=null){
					  var fields2 = new Array();
					  fields2.length = this.columnsPosition.length;
			
					  for(var i = 0; i<fields.length; i++) {
						  fields2[this.columnsPosition[i]] = fields[i];
					  }
					  
					  meta.fields = fields2;
				
				  	}else{
					  this.columnsPosition = new Array();
					  this.columnsWidth = new Array();
					  for(var i = 0; i <fields.length ;i++) {
						  this.columnsPosition[i]= i;
					  }
					  this.columnsWidth[0]=23;
					  for(var i = 1; i <fields.length ;i++) {
						  this.columnsWidth[i]= 100;
					  }

				  	}
			
			// END ORDER
			
			
		
			
			this.columnName2columnHeader = {};
			this.columnHeader2columnName = {};
			if(meta.maxSize != null && meta.maxSize !== undefined){
				this.columnsMaxSize = parseInt(meta.maxSize);
			}
			
			// iterating on each field
			for(var i = 0; i < meta.fields.length; i++) {
				
				// For i-field
				
				// map name to header and header to name
				this.columnName2columnHeader[meta.fields[i].name] = meta.fields[i].header;
				this.columnHeader2columnName[meta.fields[i].header] = meta.fields[i].name;
				
				// recalculate coumns size
				var col = meta.fields[i].name;
				for(var j = 0; j < meta.columnsInfos.length; j++) {
					if(meta.columnsInfos[j].sizeColumn !== undefined && meta.columnsInfos[j].sizeColumn == meta.fields[i].name){
						meta.fields[i].width = meta.columnsInfos[j].size;
					}
					if(meta.columnsInfos[j].unsigned !== undefined && meta.columnsInfos[j].sizeColumn == meta.fields[i].name){
						meta.fields[i].unsigned = meta.columnsInfos[j].unsigned;
					}
				}
				
				// set renderer based on field type

				if(meta.fields[i].type) {
				   var t = meta.fields[i].type;
				   if (t ==='float') { // format is applied only to numbers
					   
					   //check if format is defined in template force it, else get it from model field
					   var columnFromTemplate = this.registryConfiguration.columns[i]
					   
					   var formatToParse;
					   if(columnFromTemplate.format){
						   formatToParse = columnFromTemplate.format;
					   }
					   else{
						   formatToParse = meta.fields[i].format;
					   }
					   
					   
					   var format = Sbi.qbe.commons.Format.getFormatFromJavaPattern(formatToParse);
					   var f = Ext.apply( Sbi.locale.formats[t], format);
					   meta.fields[i].renderer = Sbi.qbe.commons.Format.floatRenderer(f);
				
				   }else{
					   if(t ==='int'){
						   meta.fields[i].renderer = Sbi.locale.formatters['string']; 
					   }else{
						   //meta.fields[i].renderer = Sbi.locale.formatters[t];
						   meta.fields[i].renderer = this.renderTooltip.createDelegate(this);
					   }
				   }   
			   }
			   
			   if(meta.fields[i].subtype && meta.fields[i].subtype === 'html') {
				   meta.fields[i].renderer  =  Sbi.locale.formatters['html'];
			   }
			   if(meta.fields[i].subtype && meta.fields[i].subtype === 'timestamp') {
				   meta.fields[i].renderer  =  Sbi.locale.formatters['timestamp'];
			   }
			   

			   // set sortable flag			   
			   if(this.sortable === false) {
				   meta.fields[i].sortable = false;
			   } else {
				   if(meta.fields[i].sortable === undefined) { // keep server value if defined
					   meta.fields[i].sortable = true;
				   }
			   }

			   // set right editor
			   var editor = this.getEditor(meta.fields[i].header, meta.fields[i].type);
			   if (editor != null) {
				   meta.fields[i].editor = editor;
			   }
			   
			   // visible columns will contain all visible fields
			   var config = this.getColumnEditorConfig(meta.fields[i].header);
			   if(config.visible == false){
					this.visibleColumns.push(meta.fields[i]);
					meta.fields[i].hidden = true;
					continue;
					
			   }else{		
				   this.visibleColumns.push(meta.fields[i]);
				   meta.fields[i].hidden = false;

			   }
			   
			   meta.fields[i].allowBlank = true;

		   } 
			// end cycling on meta.fields
			

			
			   // which columns are visible
//					 this.getColumnModel().setConfig(this.visibleColumns);
		   var columnmodel = this.getColumnModel();
		   columnmodel.setConfig(meta.fields);
		   
		   
		   //ORDER
					   	
					    for(var y=1; y<this.columnsWidth.length; y++){
					    	this.getColumnModel().setColumnWidth(y,this.columnsWidth[y]);
					   	}

						this.firstPage = false;	  
					  //END ORDER
		   
		   
		   
		   
		   this.mandatory = meta.mandatory;


		   
		   
		   
		   
		   
		   
		   
		   
		   this.on('beforeedit', function(e){			   
			   
			   /*
			    grid - This grid
			    record - The record being edited
			    field - The field name being edited
			    value - The value for the field being edited.
			    row - The grid row index
			    column - The grid column index
			    cancel - Set this to true to cancel the edit or return false from your handler.
				*/
			    var val = e.value;
			    
			    
			    var valorig; 
			    if(e.record.json != undefined){
			    	valorig = e.record.json[e.field];
			    }
			    else{
			    	valorig = e.record.data[e.field];
			    }
			    
			    
			    var t = this.visibleColumns[e.column].type;
			    var st = this.visibleColumns[e.column].subtype;
			    if(Ext.isDate(val) ){
			    	if(st != null && st !== undefined && st === 'timestamp'){
			    		e.record.data[e.field] = Sbi.qbe.commons.Format.date(val, Sbi.locale.formats['timestamp']);
			    	}else{
			    		e.record.data[e.field] = Sbi.qbe.commons.Format.date(val, Sbi.locale.formats['date']);
			    	}
			    }
			    else if(Ext.isNumber(val)){
			    	if(t === 'float'){
			    		e.record.data[e.field] = Sbi.qbe.commons.Format.number(val, Sbi.locale.formats['float']);
			    	}
			    	if(t === 'int' && valorig == ''){
			    		e.record.data[e.field] = valorig;
			    	}
			    }
			    return true;
		   }, this);
		   this.on('afteredit', function(e) {
			   
			      /*grid - This grid
				    record - The record being edited
				    field - The field name being edited
				    value - The value being set
				    originalValue - The original value for the field, before the edit.
				    row - The grid row index
				    column - The grid column index*/
				
			   var t = this.visibleColumns[e.column].type;
			   var st = this.visibleColumns[e.column].subtype;
			   if (t === 'date') {
				   var dt = new Date(Date.parse(e.value));
				   e.record.data[e.field] = dt;
			   }
			   if (t === 'float') {
				   //replace , wirth .
				   var dottedVal = e.value.replace(',', '.');
				   var f = parseFloat(dottedVal);
				   e.record.data[e.field] = f;

			   }
			 }, this);
		   
		   this.on('validateedit', function(e) {
	    	   var t = this.visibleColumns[e.column].type;
			   var st = this.visibleColumns[e.column].subtype;
			   
			   var unsigned = this.visibleColumns[e.column].unsigned;

			   if(t === 'float'){
					   var dottedVal = e.value.replace(',', '.');
					   var isfloat = isFloat(dottedVal);

					   if(!isfloat){
						   if(e.value == ''){
							   //removed
							   e.value = NaN;
							   return;
						   }
						   e.cancel = true;
						   Ext.MessageBox.show({
								title : LN('sbi.registry.registryeditorgridpanel.saveconfirm.title'),
								msg : LN('sbi.registry.registryeditorgridpanel.validation'),
								buttons : Ext.MessageBox.OK,
								width : 300,
								icon : Ext.MessageBox.INFO
							}); 
					   }
			   }

			   if(t === 'int'){
				   var isInt = isInteger(e.value);
				   
				   if(unsigned){
					   //only positive numbers
					   isInt = isUnsignedInteger(e.value);
					   
					   if(!isInt){
						   if(e.value == ''){
							   //removed
							   e.value = NaN;
							   return;
						   }
						   e.cancel = true;
						   Ext.MessageBox.show({
								title : LN('sbi.registry.registryeditorgridpanel.saveconfirm.title'),
								msg : LN('sbi.registry.registryeditorgridpanel.validation.unsigned'),
								buttons : Ext.MessageBox.OK,
								width : 300,
								icon : Ext.MessageBox.INFO
							});
						   return;
					   }
					   
				   }

				   if(!isInt){
					   if(e.value == ''){
						   //removed
						   e.value = NaN;
						   return;
					   }
					   e.cancel = true;
					   Ext.MessageBox.show({
							title : LN('sbi.registry.registryeditorgridpanel.saveconfirm.title'),
							msg : LN('sbi.registry.registryeditorgridpanel.validation'),
							buttons : Ext.MessageBox.OK,
							width : 300,
							icon : Ext.MessageBox.INFO
						}); 
				   }
			   }

		 }, this);

		}, this);
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

	}

	,
	onDataStoreLoadException: function(response, options) {
		Sbi.exception.ExceptionHandler.handleFailure(response, options);
	}
	
	,
	getEditor : function (field, type) {
		var toReturn = null;
		var editorConfig = this.getColumnEditorConfig(field);

		if (editorConfig.editable == true) {
			if (editorConfig.editor == "COMBO") {
				
				if(type === 'boolean'){
					toReturn = this.createFieldBoolean(field);
				}else{
					toReturn = this.createFieldCombo(field);
				}
			} else {
				toReturn = new Ext.form.TextField();
			}
		}
		return toReturn;
	}

	,
	getColumnEditorConfig : function (field) {

		var columnsConf = this.getColumnsConfiguration();
		var toReturn = {  // default values
				editable : true
				, visible : true
		};
		for (var i = 0; i < columnsConf.length; i++) {
			if (columnsConf[i].field == field) {
				toReturn = Ext.apply(toReturn, columnsConf[i]);
				break;
			}
		}
		return toReturn;
	}
	
	,
	initToolbar : function () {
		var items = this.initFiltersToolbarItems();
		this.gridToolbar = new Ext.Toolbar(items);
	}
	
	,
	initFiltersToolbarItems : function () {
		var items = [];
		
		var enableButtons = this.getConfiguration('enableButtons');
		if(enableButtons && enableButtons == "true"){		
		items.push({
			iconCls: 'icon-add',
			handler : this.addNewRecord,
			scope : this
		});
		
		items.push({
			iconCls: 'icon-delete',
			handler : function(){
				Ext.MessageBox.confirm(
						LN('sbi.worksheet.designer.msg.deletetab.title'),
						LN('sbi.worksheet.designer.msg.deletetab.msg'),            
			            function(btn, text) {
			                if (btn=='yes') {
			    				this.deleteRecord();
			                }
			            },
			            this
					);
			},
			scope : this
		});
		
		}
		
		items.push({
			iconCls : 'icon-save',
			handler : this.save,
			scope : this
		});
//		items.push({
//			iconCls : 'icon-refresh',
//			handler : this.refresh,
//			scope : this
//		});
		items.push({xtype: 'tbspacer', width: 30});
		items.push({
			iconCls : 'icon-clear',
			handler : this.clearFilterForm,
			scope : this
		});
		this.filters = [];
		var filtersConf = this.getFiltersConfiguration();
		if (filtersConf.length > 0) {
			for (var i = 0 ; i < filtersConf.length ; i++) {
				var aFilter = filtersConf[i];
				if (aFilter.presentation != undefined && aFilter.presentation == "DRIVER") {}
				else{
					items.push({xtype: 'tbtext', text: aFilter.title, style: {'padding-left': 20}});
					var filterField = this.createFilterField(aFilter);
					items.push(filterField);
					this.filters.push(filterField); // save filters into local variable this.filters
				}
			}
	}
		
		items.push({xtype: 'tbspacer', width: 30});
		items.push({
			iconCls : 'icon-execute',
			handler : this.applyFilter,
			scope : this
		});

		//	items.push({xtype: 'tbspacer', width: 150});



		return items;
	}
	
	,
	getFiltersConfiguration : function () {
		var toReturn = [];
		if (this.registryConfiguration != undefined && this.registryConfiguration != null) {
			toReturn = this.registryConfiguration.filters;
		}
		return toReturn;
	}
	
	,
	getColumnsConfiguration : function () {
		var toReturn = [];
		if (this.registryConfiguration != undefined && this.registryConfiguration != null) {
			toReturn = this.registryConfiguration.columns;
		}
		return toReturn;
	}

	,
	getColumnConfiguration : function (field) {
		var columns = this.getColumnsConfiguration();
		for (var i = 0; i < columns.length; i++) {
			if (columns[i].field == field) {
				return columns[i];
			}
		}
		return null;
	}
	
	,
	getConfiguration : function (name) {
		if (this.registryConfiguration != undefined && this.registryConfiguration != null) {
			var confs = this.registryConfiguration.configurations;
			for (var i = 0; i < confs.length; i++) {
				if (confs[i].name == name) {
					return confs[i].value;
				}
			}
		
		}
		return;
	}

	,
	createFilterField : function (aFilter) {
		var filterField = null;
		if (aFilter.presentation != undefined && aFilter.presentation == "COMBO") {
			filterField = this.createFieldCombo(aFilter.field);
			filterField.type = "COMBO";
			//filterField.on('change', this.filterMainStore, this);
		} 
		else		
		{
			filterField = new Ext.form.TextField({
				name: aFilter.field
//				, enableKeyEvents : true
//				, listeners : {
//					keyup : this.setKeyUpTimeout
//					, scope: this
//				}
			});
			filterField.type = "TEXT";
		}
		return filterField;
	}
	,
	createFieldBoolean: function(field) {

		var combo = new Ext.form.ComboBox({
			name: field
            , editable : false
            , store: new Ext.data.SimpleStore({
            	fields: ['column_1'],
                data: [['true'], ['false']]
            })
	        , displayField: 'column_1'
	        , valueField: 'column_1'
	        , mode:'local'
	        , triggerAction: 'all'
        });
		
		return combo;
	}
	,
	createFieldCombo: function(field) {
		var store = new Ext.data.JsonStore({
			url: this.services['getFieldDistinctValues']
		});
		var temp = this.registryConfiguration.entity;
		var index = this.registryConfiguration.entity.indexOf('::');
		if (index != -1) {
			temp = this.registryConfiguration.entity.substring(0 , index);
		}
		var entityId = null;
		var column = this.getColumnConfiguration(field);
		if (column.subEntity) {
			entityId = temp + "::" + column.subEntity + "(" + column.foreignKey + ")" + ":" + field;
		} else {
			entityId = temp + ':' + field;
		}

		var baseParams = {
			'QUERY_TYPE': 'standard', 
			'ENTITY_ID': entityId, 
			'ORDER_ENTITY': entityId, 
			'ORDER_TYPE': 'asc', 
			'QUERY_ROOT_ENTITY': true
		};
		store.baseParams = baseParams;
		store.on('loadexception', function(store, options, response, e) {
			Sbi.exception.ExceptionHandler.handleFailure(response, options);
		});
		
		var combo = new Ext.form.ComboBox({
			name: field
            , editable : false
            , store: store
	        , displayField: 'column_1'
	        , valueField: 'column_1'
	        , triggerAction: 'all'
        });
		
		return combo;
	}	
	
	,
	setKeyUpTimeout : function () {
        clearTimeout(this.keyUpTimeoutId);
        this.keyUpTimeoutId = (function() {
	          this.keyUpTimeoutId = null;
	          this.filterMainStore();
	    }).defer(500, this);
	}
	
	,
	filterMainStore : function () {
		var filtersValuesObject = this.getFiltersValuesAndType();
		var filterFunction = this.createFilterFunction(filtersValuesObject);
		this.store.filterBy(filterFunction);
	}
	
	,
	getFiltersValues : function () {
		var filtersValuesObject = {};
		for (var i = 0 ; i < this.filters.length ; i++) {
			var aFilter = this.filters[i];
			//			filtersValuesObject[aFilter.getName()] = {
//				value : aFilter.getValue()
//			};
			filtersValuesObject[aFilter.getName()] = aFilter.getValue();
		}
		return filtersValuesObject;
	}
	,
	getFiltersValuesAndType : function () {
		var filtersValuesObject = {};
		for (var i = 0 ; i < this.filters.length ; i++) {
			var aFilter = this.filters[i];
			filtersValuesObject[aFilter.getName()] = {
				value : aFilter.getValue()
				, type : aFilter.type
			};
		}
		return filtersValuesObject;
	}	
	,
	createFilterFunction : function (filtersValuesObject) {
		var columnHeader2columnName = this.columnHeader2columnName;
		var filterFunction = function (record, recordId) {
			for (var aFilterName in filtersValuesObject) {
				var filterObject = filtersValuesObject[aFilterName];
				// filter name corresponds to the column header, so we retrieve the relevant column name
				var columnName = columnHeader2columnName[aFilterName];
				var fieldValue = record.get(columnName).toString();
				var filterType = filterObject.type;
				var filterValue = filterObject.value;
				var fieldCompareValue = null;
				if (filterType == 'COMBO') {
					fieldCompareValue = fieldValue;
					if (filterValue == '') {
						continue;
					}
				} else {
					filterValue = filterValue.toUpperCase();
					fieldCompareValue = fieldValue.substring(0, filterValue.length).toUpperCase();
				}
				if (filterValue != fieldCompareValue) {
					return false;
				}
			}
			return true;
		};
		return filterFunction;
	}
	
	,
	clearFilterForm: function () {
		for (var i = 0 ; i < this.filters.length ; i++) {
			var aFilter = this.filters[i];
			if (aFilter.type == "COMBO") {
				aFilter.clearValue();
			} else {
				aFilter.setValue('');
			}
		}
		this.store.clearFilter(false);
	}
	, hasMandatoryColumnRespected: function(aRecordData){
		var ok = '';
		for(i =0; i<this.mandatory.length; i++){
			var columnToCheck = this.mandatory[i].column;
			var col = aRecordData[columnToCheck];
			if(col === undefined || col == null || col === '' || isNaN(col)){
				var columnRef = this.mandatory[i].mandatoryColumn;
				var valueRef = this.mandatory[i].mandatoryValue;
				var value = aRecordData[columnRef];
				if(value !== undefined && value !== null && value === valueRef){
					return columnToCheck;					
				}
			}
		}
		return ok;
	}
	,
	saveSingleRecord : function (index, modifiedRecords) {
		var recordsData = [];

		if(index<modifiedRecords.length){

			var aRecordData = Ext.apply({}, modifiedRecords[index].data);
			delete aRecordData.recNo; // record number is not something to be persisted
			recordsData.push(aRecordData);
			var colMandatory= this.hasMandatoryColumnRespected(aRecordData);
			if(colMandatory !== ''){
				Ext.MessageBox.show({
					title : LN('sbi.registry.registryeditorgridpanel.saveconfirm.title'),
					msg : colMandatory +" "+LN('sbi.registry.registryeditorgridpanel.mandatory'),
					buttons : Ext.MessageBox.OK,
					width : 300,
					icon : Ext.MessageBox.INFO
				});

				return;
			}
			Ext.Ajax.request({
				url: this.services['update'],
				method: 'post',
				params: {"records" : Sbi.commons.JSON.encode(recordsData)},
				success : 
					function(response, opts) {
					try {
						var firstQuery = Ext.util.JSON.decode( response.responseText );
						var key = firstQuery.keyField;
						var id = firstQuery.ids[0];
						if(id){
							var record = modifiedRecords[index];
							record.set(key, id);
							this.doLayout();
						}
						//this.saveSingleRecord.createDelegate(this, [index + 1, modifiedRecords], false);
						this.saveSingleRecord(index + 1, modifiedRecords);
					} catch (err) {
						Sbi.exception.ExceptionHandler.handleFailure();
					}
				},
				failure: function(msg, title){
					for(var j=0; j<index;j++){
						modifiedRecords[0].commit();
					}
					Ext.MessageBox.show({
						title : LN('sbi.registry.registryeditorgridpanel.saveconfirm.title'),
						msg : LN('sbi.registry.registryeditorgridpanel.saveconfirm.message.ko'),
						buttons : Ext.MessageBox.OK,
						width : 300,
						icon : Ext.MessageBox.INFO
					});
				},
				scope: this
			});
		}else{
			this.updateSuccessHandler();
		}
	}
	
	,
	save: function () {
		var modifiedRecords = this.store.getModifiedRecords();
		this.saveSingleRecord(0,modifiedRecords);
	}
	,
	refresh: function () {
		this.view.refresh();
	}
	,
	applyFilter: function () {
		// read filters
		var filtersValuesObject = this.getFiltersValues();
		
		this.load(filtersValuesObject);
	}
	,
	addNewRecord: function () {

		var emptyRecord = new Object();
		
		for(var i = 1; i < this.visibleColumns.length; i++) {
			emptyRecord[this.visibleColumns[i].name] = ''; 
		}
		//meta.fields[0] = new Ext.grid.RowNumberer();
		var array = []
		for(var i = 1; i < this.visibleColumns.length; i++) {
			var obj = new Object()
			var col = this.visibleColumns[i];
			obj['name'] = col.name; 
			obj['type'] = col.type; 
			obj['allowBlank'] = this.visibleColumns[i].allowBlank; 
			obj['dataIndex'] = this.visibleColumns[i].dataIndex; 
			obj['header'] = this.visibleColumns[i].header; 
			obj['hidden'] = this.visibleColumns[i].hidden; 
			obj['id'] = this.visibleColumns[i].id; 
			obj['renderer'] = this.visibleColumns[i].renderer; 
			obj['sortable'] = this.visibleColumns[i].sortable; 
			obj['width'] = this.visibleColumns[i].width; 

			array.push(obj);		
		}
	
		var recordConstructor = Ext.data.Record.create(obj);
	
		var row = new recordConstructor(emptyRecord); 
		this.store.add([row]);
		//this.store.insert(0,[row]);
		

	}
	,
	deleteRecord: function () {

		var selectionModel = this.getSelectionModel();

		var cellsSelected = selectionModel.getSelectedCell(); 		

		var rowIndex = cellsSelected[0];
		
		rowIndex = rowIndex +1; 
		this.deletedRows = [rowIndex];
		
		var record = this.store.getById(rowIndex);

		var recordsArray =[];
		if(record){
				recordsArray = [record.json];
		}
		
		
		Ext.Ajax.request({
			url: this.services['delete'],
			method: 'post',
			params: {"records" : Sbi.commons.JSON.encode(recordsArray)},
			success : 
				function(response, opts) {
				try {
					for ( var indic = 0; indic < this.deletedRows.length; indic++) {
						var index = this.deletedRows[indic];
						this.store.removeAt(index);	
					}
					var params = {}
					if(this.start != null){
						params.start = this.start;
					}
					if(this.limit != null){
						params.limit = this.limit;
					}
					
					var filtersValuesObject = this.getFiltersValues();
					Ext.apply(params, filtersValuesObject);

					this.loadFrom(params);

				} catch (err) {
					Sbi.exception.ExceptionHandler.handleFailure();
				}
			},
			failure: function(msg, title){
				Ext.MessageBox.show({
					title : LN('sbi.registry.registryeditorgridpanel.saveconfirm.title'),
					msg : LN('sbi.registry.registryeditorgridpanel.saveconfirm.message.ko'),
					buttons : Ext.MessageBox.OK,
					width : 300,
					icon : Ext.MessageBox.INFO
				});
			},
			scope: this
		});
	}

	,
	updateSuccessHandler : function () {
		Ext.MessageBox.show({
			title : LN('sbi.registry.registryeditorgridpanel.saveconfirm.title'),
			msg : LN('sbi.registry.registryeditorgridpanel.saveconfirm.message'),
			buttons : Ext.MessageBox.OK,
			width : 300,
			icon : Ext.MessageBox.INFO
		});
		this.store.commitChanges();
	}

	
	
	
});
function isInteger(s) {
	  return (s.search(/^-?[0-9]+$/) == 0);
}
function isUnsignedInteger(s) {
	  return (s.search(/^[0-9]+$/) == 0);
}
function isFloat(s){
	return (s.search(/^[0-9]*[.][0-9]+$/) == 0);
}

