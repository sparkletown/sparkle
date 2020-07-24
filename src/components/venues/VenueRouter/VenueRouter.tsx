import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import TemplateRouter from "components/venues/TemplateRouter";

const VenueRouter = () => (
  <Switch>
    <Route path="/venue/:venueId" component={TemplateRouter} />
    <Route path="/" component={() => <Redirect to="/venue/kansassmittys" />} />
  </Switch>
);

export default VenueRouter;
