import React, { useReducer } from "react";
import projectContext from "./projectContext";
import projectReducer from "./projectReducer";
import {
  TOGGLE_PROJECT_FORM,
  GET_PROJECTS,
  ADD_PROJECT,
  VALIDATE_PROJECT_FORM,
  ACTUAL_PROJECT,
  DELETE_PROJECT,
  PROJECT_ERROR
} from "../../types";
import { createProject, getUserProjects, deleteProject } from "../../services/projects.services";

const ProjectState = (props) => {
  const initialState = {
    newProjectForm: false, // Controls visibility of New Project form
    formError: false,
    projects: [],
    actualProject: null,
    message: null
  };

  // Dispatch to execute actions that modify the state
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Functions to execute project related actions
  const toggleForm = () => {   // Show 'create new project' form
    dispatch({
      type: TOGGLE_PROJECT_FORM,
    });
  };

  const getProjects = async () => {  // Get existing projects
    try {
      const apiGetProjectsResponse = await getUserProjects();
      dispatch({
        type: GET_PROJECTS,
        payload: apiGetProjectsResponse.data.projects,
      });
    } catch (error) {
      const alert = {
        msg: 'Something went wrong when trying to delete a project',
        category: 'alerta-error'
      };
      dispatch({
        type: PROJECT_ERROR,
        payload: alert
      });
    };
  };

  const addProject = async (project) => {
    try {
      const apiCreateProjectResponse = await createProject(project);
      dispatch({                        
        type: ADD_PROJECT,              
        payload: apiCreateProjectResponse,
      });
    } catch (error) {
      const alert = {
        msg: 'Something went wrong when trying to delete a project',
        category: 'alerta-error'
      };
      dispatch({
        type: PROJECT_ERROR,
        payload: alert
      });
    };
  };

  const handleFormError = () => {     
    dispatch({
      type: VALIDATE_PROJECT_FORM
    });
  };

  const handleActualProject = projectId => {    
    dispatch({
      type: ACTUAL_PROJECT,
      payload: projectId
    });
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      dispatch({
        type: DELETE_PROJECT,
        payload: projectId
      });
    } catch (error) {
      const alert = {
        msg: 'Something went wrong when trying to delete a project',
        category: 'alerta-error'
      };
      dispatch({
        type: PROJECT_ERROR,
        payload: alert
      });
    };
  };

  return (
    <projectContext.Provider
      value={{
        // State variables
        newProjectForm: state.newProjectForm,
        projects: state.projects,
        formError: state.formError,
        actualProject: state.actualProject,
        message: state.message,
        // Functions
        toggleForm,
        getProjects,
        addProject,
        handleFormError,
        handleActualProject,
        handleDeleteProject
      }}
    >
      {props.children}
    </projectContext.Provider>
  );
};

export default ProjectState;
