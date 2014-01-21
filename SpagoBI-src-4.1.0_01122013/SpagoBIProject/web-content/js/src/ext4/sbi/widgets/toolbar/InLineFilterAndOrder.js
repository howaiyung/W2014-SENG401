/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/

/**
 * 
 * 
 * Toolbar with a text field used for the research. It should be used with the store {@link Sbi.widgets.store.InMemoryFilteredStore#InMemoryFilteredStore}.
 * When the user type a text it is passed as argument of the load function of the store. The name of the arguments is filterString. 
 * 
 * 
 * 
 *     @example
 *     ...
 *		this.tbar = Ext.create('Sbi.widgets.grid.InLineFilterAndOrder',Ext.apply({store: this.store, additionalButtons:additionalButtons}));
 *     ...
 * 
 * @author
 * Alberto Ghedin (alberto.ghedin@eng.it) 
 */
Ext.define('Sbi.widgets.toolbar.InLineFilterAndOrder', {
    extend: 'Ext.toolbar.Toolbar'

    ,config: {
    	/**
    	 * The store to filter. To have a live filtering this store should be of type {@link Sbi.widgets.store.InMemoryFilteredStore#InMemoryFilteredStore}
    	 * MANDATORY
    	 */
    	store: null,
    	/**
    	 * @private
    	 * Private variable used from the defer
    	 */
    	keyPressedTimeOut: null,
    	/**
    	 * Additional buttons to add in the toolbar. Take a look at {@link Sbi.widget.toolbar.StaticToolbarBuilder#StaticToolbarBuilder}
    	 */
    	additionalButtons:null,    	
    	/**
    	 * Additional sorters to add in the toolbar. 
    	 */
    	additionalSorters:null,    	
    	/**
    	 * Milliseconds of delay between the last key pressed and the application of the filter
    	 */
    	keyPressedDelay: 400,
    	
    	alignToRight: false
    	
//    	,emptyLabel:null
    	
    }

	, constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
	}

	, onRender : function(ct, position) {
	    var thisPanel = this;
		Sbi.widgets.grid.DynamicFilteringToolbar.superclass.onRender.call(this, ct, position);

		if (this.alignToRight){
			this.add('->');
		}
		
	    this.valueField = Ext.create('Ext.form.field.Trigger', {
	    	triggerCls:'x-form-clear-trigger',
	    	width: 120,
//	    	emptyText:(this.emptyLabel !== null)?this.emptyLabel:'',
	    	enableKeyEvents: true,
	    	onTriggerClick: function(e) {
	    		if(this.inputEl.dom.className.indexOf("x-form-text-search")<0){
            		this.inputEl.dom.className+=" x-form-text-search";
            	}
	    		this.setValue("");
	    		thisPanel.filter("")
			},
	    	listeners: {
	    	            keyup: function(textField, event, eOpts){
	    	            	//reload the store if no key has been pressed since 400 milliseconds
	    	            	if(textField.getValue()==""){
	    	            		textField.inputEl.dom.className+=" x-form-text-search";
	    	            	}else if(textField.inputEl.dom.className.indexOf("x-form-text-search")>=0){
	    	            		textField.inputEl.dom.className=textField.inputEl.dom.className.replace("x-form-text-search","");
	    	            	}
	    	            	if(this.keyPressedTimeOut){
	    	            		clearTimeout(this.keyPressedTimeOut);
	    	            	}        	
	    	            	this.keyPressedTimeOut=Ext.defer(this.filter,this.keyPressedDelay,this,[textField.getValue()]);

	    	    	    },
	    	    	    render: function(textField){//ad the background
	    	    	    	textField.inputEl.dom.className+=" x-form-text-search";
	    	    	    },
	    	    	    scope: thisPanel
	    	}
	    	
	    });

	    this.add( this.valueField ); 
	    
	    if (this.additionalSorters){
	    	//adds combo with sorters values			
	    	for(var i=0; i<this.additionalSorters.length;i++){
	    		var sortElem = this.additionalSorters[i];	    		
	    		sortElem.on('change', this.order, this);
				this.add(sortElem);
			}		
	    }

		if(this.additionalButtons){
			if(!this.alignToRight) this.add('->');
			for(var i=0; i<this.additionalButtons.length;i++){
				this.add(this.additionalButtons[i]);
			}
		}
	}
	
	/**
	 * Filter the store and throws the filter event
	 * @private
	 * @param {String} textValue the value of the filter
	 */
	, filter: function(textValue){
		if(!textValue || textValue==""){
			this.fireEvent("filter",{filterString: ""});
			this.store.load({reset: true, filterString: ""});
		}else{
			this.fireEvent("filter",{filterString: textValue});
			this.store.load({filterString: textValue});
		}

	}
	
	/**
	 * Order the store and throws the order event
	 * @private
	 * @param {String} value the value of the orderField
	 */
	, order: function(value){
		var recOrder = (value.lastSelection!==undefined)?value.lastSelection[0]:null;			
		var config = {};
		if (recOrder != null){
			config.property = recOrder.get('property') || "";
			config.direction =  recOrder.get('direction') || "";
		}
		this.fireEvent("order",config);	
	}
	 
});