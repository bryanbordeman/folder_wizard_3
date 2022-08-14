import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Home from '../pages/Home';

function MainRoutes(props) {
    const { user, token, login, signup, loginErrors, darkState, handleOpenSnackbar } = props
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