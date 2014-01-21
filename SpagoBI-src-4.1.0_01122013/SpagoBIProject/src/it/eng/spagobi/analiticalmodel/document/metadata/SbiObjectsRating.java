/* SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. */
package it.eng.spagobi.analiticalmodel.document.metadata;

import it.eng.spagobi.commons.metadata.SbiHibernateModel;
// Generated 23-apr-2008 15.08.55 by Hibernate Tools 3.1.0 beta3



/**
 * SbiObjectsRating generated by hbm2java
 */

public class SbiObjectsRating  extends SbiHibernateModel {


    // Fields    

     private SbiObjectsRatingId id;
     private SbiObjects sbiObjects;
     private Integer rating;


    // Constructors

    /**
     * default constructor.
     */
    public SbiObjectsRating() {
    }

    
    /**
     * full constructor.
     * 
     * @param id the id
     * @param sbiObjects the sbi objects
     * @param rating the rating
     */
    public SbiObjectsRating(SbiObjectsRatingId id, SbiObjects sbiObjects, Integer rating) {
        this.id = id;
        this.sbiObjects = sbiObjects;
        this.rating = rating;
    }
    

   
    // Property accessors

    /**
     * Gets the id.
     * 
     * @return the id
     */
    public SbiObjectsRatingId getId() {
        return this.id;
    }
    
    /**
     * Sets the id.
     * 
     * @param id the new id
     */
    public void setId(SbiObjectsRatingId id) {
        this.id = id;
    }

    /**
     * Gets the sbi objects.
     * 
     * @return the sbi objects
     */
    public SbiObjects getSbiObjects() {
        return this.sbiObjects;
    }
    
    /**
     * Sets the sbi objects.
     * 
     * @param sbiObjects the new sbi objects
     */
    public void setSbiObjects(SbiObjects sbiObjects) {
        this.sbiObjects = sbiObjects;
    }

    /**
     * Gets the rating.
     * 
     * @return the rating
     */
    public Integer getRating() {
        return this.rating;
    }
    
    /**
     * Sets the rating.
     * 
     * @param rating the new rating
     */
    public void setRating(Integer rating) {
        this.rating = rating;
    }
   








}
