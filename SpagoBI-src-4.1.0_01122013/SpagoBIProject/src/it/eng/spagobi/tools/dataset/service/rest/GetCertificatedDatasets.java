/*
 * SpagoBI, the Open Source Business Intelligence suite
 * � 2005-2015 Engineering Group
 *
 * This file is part of SpagoBI. SpagoBI is free software: you can redistribute it and/or modify it under the terms of the GNU
 * Lesser General Public License as published by the Free Software Foundation, either version 2.1 of the License, or any later version. 
 * SpagoBI is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details. You should have received
 * a copy of the GNU Lesser General Public License along with SpagoBI. If not, see: http://www.gnu.org/licenses/.
 * The complete text of SpagoBI license is included in the COPYING.LESSER file. 
 */
package it.eng.spagobi.tools.dataset.service.rest;

import it.eng.spago.error.EMFInternalError;
import it.eng.spago.security.IEngUserProfile;
import it.eng.spagobi.commons.constants.SpagoBIConstants;
import it.eng.spagobi.commons.dao.DAOFactory;
import it.eng.spagobi.commons.serializer.SerializerFactory;
import it.eng.spagobi.tools.dataset.bo.IDataSet;
import it.eng.spagobi.tools.dataset.dao.IDataSetDAO;
import it.eng.spagobi.utilities.exceptions.SpagoBIServiceException;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * @author Davide Zerbetto (davide.zerbetto@eng.it)
 * 
 */
@Path("/certificateddatasets")
public class GetCertificatedDatasets {

	static private Logger logger = Logger
			.getLogger(GetCertificatedDatasets.class);

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getAllDataSet(@Context HttpServletRequest req) {
		IDataSetDAO dataSetDao = null;
		List<IDataSet> dataSets;
		IEngUserProfile profile = (IEngUserProfile) req.getSession()
				.getAttribute(IEngUserProfile.ENG_USER_PROFILE);
		JSONObject JSONReturn = new JSONObject();
		JSONArray datasetsJSONArray = new JSONArray();
		try {
			dataSetDao = DAOFactory.getDataSetDAO();
			dataSetDao.setUserProfile(profile);
			String isTech = req.getParameter("isTech");

			if(isTech != null && isTech.equals("true")){
				//if is technical dataset == ENTERPRISE --> get all ADMIN/DEV public datasets
				dataSets = dataSetDao.loadEnterpriseDatasets(profile.getUserUniqueIdentifier().toString());
			}else{
				//else it is a custom dataset list --> get all datasets public with owner != user itself
				dataSets = dataSetDao.loadSharedDatasets(profile.getUserUniqueIdentifier().toString());
			}

			datasetsJSONArray = (JSONArray) SerializerFactory.getSerializer(
					"application/json").serialize(dataSets, null);
			
			JSONArray datasetsJSONReturn = putActions(profile, datasetsJSONArray);

			JSONReturn.put("root", datasetsJSONReturn);

		} catch (Throwable t) {
			throw new SpagoBIServiceException(
					"An unexpected error occured while instatiating the dao", t);
		}
		return JSONReturn.toString();

	}

	private JSONArray putActions(IEngUserProfile profile, JSONArray datasetsJSONArray)
			throws JSONException, EMFInternalError {
		JSONObject worksheetAction = new JSONObject();
		worksheetAction.put("name", "worksheet");
		worksheetAction.put("description", "Show Worksheet");
		
		JSONObject qbeAction = new JSONObject();
		qbeAction.put("name", "qbe");
		qbeAction.put("description", "Show Qbe");
		
		JSONArray datasetsJSONReturn = new JSONArray();	
		for(int i = 0; i < datasetsJSONArray.length(); i++) {
			JSONArray actions = new JSONArray();
			JSONObject datasetJSON = datasetsJSONArray.getJSONObject(i);		
			actions.put(worksheetAction);
			if (profile.getFunctionalities().contains(SpagoBIConstants.BUILD_QBE_QUERIES_FUNCTIONALITY)){
				actions.put(qbeAction);
			}
			datasetJSON.put("actions", actions);
			datasetsJSONReturn.put(datasetJSON);
		}
		return datasetsJSONReturn;
	}

}
