import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Home from '../pages/Home';
import Opportunity from '../pages/Opportunity';
import OpportunityEdit from '../pages/OpportunityEdit';
import Project from '../pages/Project';
import ProjectEdit from '../pages/ProjectEdit';
import QuoteLog from '../pages/QuoteLog';
import ProjectLog from '../pages/ProjectLog';

function MainRoutes(props) {
    const { user, token, login, logout, signup, loginErrors, darkState, handleOpenSnackbar } = props
    return (
        <div>
            <Routes>
                <Route 
                    exact 
                    path='/' 
                    element={
                        !user.username  ? 
                        <Navigate to="/login" />
                        : 
                        <Home
                        user={user}
                        token={token}
                        logout={logout}
                        darkState={darkState}
                        />
                    }/>
                <Route 
                    exact 
                    path='/opportunity' 
                    element={
                        !user.username  ? 
                        <Navigate to="/login" />
                        :
                        <Opportunity
                            user={user}
                            token={token}
                            handleOpenSnackbar={handleOpenSnackbar}
                        />
                }/>
                <Route 
                    exact 
                    path='/opportunity/edit' 
                    element={
                        !user.username  ? 
                        <Navigate to="/login" />
                        :
                        <OpportunityEdit
                            user={user}
                            token={token}
                            handleOpenSnackbar={handleOpenSnackbar}
                        />
                }/>
                <Route 
                    exact 
                    path='/quotelog' 
                    element={
                        !user.username  ? 
                        <Navigate to="/login" />
                        :
                        <QuoteLog
                            user={user}
                            token={token}
                            handleOpenSnackbar={handleOpenSnackbar}
                        />
                }/>
                
                <Route 
                    exact 
                    path='/project' 
                    element={
                        !user.username  ? 
                        <Navigate to="/login" />
                        :
                        <Project
                            darkState={darkState}
                            user={user}
                            token={token}
                            handleOpenSnackbar={handleOpenSnackbar}
                        />
                }/>
                <Route 
                    exact 
                    path='/project/edit' 
                    element={
                        !user.username  ? 
                        <Navigate to="/login" />
                        :
                        <ProjectEdit
                            darkState={darkState}
                            user={user}
                            token={token}
                            handleOpenSnackbar={handleOpenSnackbar}
                        />
                }/>
                <Route 
                    exact 
                    path='/projectlog' 
                    element={
                        !user.username  ? 
                        <Navigate to="/login" />
                        :
                        <ProjectLog
                            user={user}
                            token={token}
                            handleOpenSnackbar={handleOpenSnackbar}
                            darkState={darkState}
                        />
                }/>
                <Route 
                    exact 
                    path='/login' 
                    element={
                        user.username  ? 
                        <Navigate to="/" />
                        :
                        <Login 
                            login={login} 
                            errors={loginErrors}
                            darkState={darkState}
                        /> 
                    }
                />
                <Route 
                    exact 
                    path='/signup' 
                    element={
                        <Signup 
                            signup={signup} 
                        />
                    }/>

                <Route render={() => <h1>Error 404</h1>}/>
            </Routes>
        </div>
    );
};

export default MainRoutes;