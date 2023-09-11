import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainLayout from "../MainLayout";
import PlannerLayout from "../PlannerLayout";

const RoutingGeneral = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={MainLayout} />
        <Route path="/planner" component={PlannerLayout} />
      </Switch>
    </Router>
  );
};

export default RoutingGeneral;
