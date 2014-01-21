/* SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. */
package it.eng.spagobi.tools.dataset.dao;

import it.eng.spago.error.EMFUserError;
import it.eng.spagobi.commons.dao.ISpagoBIDao;
import it.eng.spagobi.tools.dataset.bo.IDataSet;
import it.eng.spagobi.tools.dataset.metadata.SbiDataSet;
import it.eng.spagobi.tools.datasource.bo.IDataSource;

import java.util.List;

/**
 * Defines the interfaces for all methods needed to create, 
 * read, update and delete a dataset (CRUD operations).
 */
public interface IDataSetDAO extends ISpagoBIDao {
	
	// ========================================================================================
	// CEATE operations (Crud)
	// ========================================================================================
	public Integer insertDataSet(IDataSet dataSet);
	
	
	// ========================================================================================
	// READ operations (cRud)
	// ========================================================================================
	
	public List<IDataSet> loadAllActiveDataSets();
	public List<IDataSet> loadAllActiveDataSetsByOwner(String owner);
	public List<IDataSet> loadAllActiveDataSetsByOwnerAndType(String owner, String type);
	public IDataSet loadActiveDataSetByLabel(String label);
	public IDataSet loadActiveIDataSetByID(Integer id);
	
	public List<IDataSet> loadFilteredDatasetList(String hsql, Integer offset, Integer fetchSize);
	public List<IDataSet> loadPagedDatasetList(Integer offset, Integer fetchSize);
	public List<IDataSet> loadFilteredDatasetList(String hsql, Integer offset, Integer fetchSize, String owner);
	public List<IDataSet> loadPagedDatasetList(Integer offset, Integer fetchSize, String owner, Boolean isPublic);
	public IDataSet loadDataSetById(Integer dsId) ;
	public IDataSet loadDataSetByLabel(String dsLabel);
	public IDataSet loadDataSetByOwner(String owner);
	
	public List<IDataSet> loadMyDataOwnerDatasets(String owner);
	public List<IDataSet> loadMyDataOwnerAndSharedDatasets(String owner);
	public List<IDataSet> loadEnterpriseDatasets(String owner);
	public List<IDataSet> loadSharedDatasets(String owner);
	
	/**
	 * @deprecated
	 */
	public List<SbiDataSet> loadPagedSbiDatasetConfigList(Integer offset, Integer fetchSize);
	
	public Integer countBIObjAssociated(Integer dsId);
	public Integer countDatasets();
	public boolean hasBIObjAssociated (String dsId);
	public boolean hasBIKpiAssociated (String dsId);
	public boolean hasBILovAssociated (String dsId);
	
	// ========================================================================================
	// UPDATE operations (crUd)
	// ========================================================================================
	
	public void modifyDataSet(IDataSet dataSet);
	public IDataSet restoreOlderDataSetVersion(Integer dsId, Integer dsVersion);
	public Integer getHigherVersionNumForDS(Integer dsId);
	
	
	// ========================================================================================
	// DELETE operations (cruD)
	// ========================================================================================
	public void deleteDataSet(Integer dsID);
	public boolean deleteInactiveDataSetVersion(Integer dsVerdionID, Integer dsId);
	public boolean deleteAllInactiveDataSetVersions(Integer dsID);
	public void deleteDataSetNoChecks(Integer dsID);

	// ========================================================================================
	// UTILITY methods
	// ========================================================================================
	/**
	 * @deprecated
	 */
	public IDataSet toGuiGenericDataSet(IDataSet iDataSet);
	
	/**
	 * @deprecated
	 */
	public SbiDataSet copyDataSet(SbiDataSet hibDataSet);
}
