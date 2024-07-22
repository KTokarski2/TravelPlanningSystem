import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Layout/PrivateRoute';
import Home from './components/Home/Home';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Trip from './components/Trip/Trips';
import NewTripForm from './components/Trip/NewTripForm';
import Friends from './components/Friends/Friends';
import AddFriendsForm from './components/Friends/AddFriendForm';
import MyProfile from './components/Profile/MyProfile';
import TripDetails from './components/Trip/TripDetails';
import NewPlaceForm from './components/Place/NewPlaceForm';
import PlaceDetails from './components/Place/PlaceDetails';
import UserProfile from './components/Profile/UserProfile';
import AddFriendToTrip from './components/Trip/AddFriendToTrip';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path={'/login'} element={<LoginForm />}/>
                    <Route path={'/register'} element={<RegisterForm />}/>
                </Route>
                <Route path={"/"} element={<Layout />}>
                    <Route path={"/"} element={<PrivateRoute />}>
                        <Route path={'/trips'} element={<Trip />}/>
                        <Route path={'/trips/new'} element={<NewTripForm />}/>
                        <Route path={'/friends'} element={<Friends />}/>
                        <Route path={'/friends/add'} element={<AddFriendsForm/>}/>
                        <Route path={'/profile/me'} element={<MyProfile/>}/>
                        <Route path={'/users/profile/:id'} element={<UserProfile/>}/>
                        <Route path={'/trips/details/:id'} element={<TripDetails/>}/>
                        <Route path={'/trips/:id/places/new'} element={<NewPlaceForm/>}/>
                        <Route path={'/trips/:tripId/places/details/:placeId'} element={<PlaceDetails/>}/>
                        <Route path={'/trips/:tripId/add-friend'} element={<AddFriendToTrip/>}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;