import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadBugs, resolveBug, getUnresolvedBugs } from "../store/bugs";

const Bugs = () => {
  const dispatch = useDispatch();
  const bugs = useSelector(getUnresolvedBugs);

  useEffect(() => {
    dispatch(loadBugs());
  }, [dispatch]);

  return (
    <ul>
      {bugs.map(bug => (
        <li key={bug.id}>
          {bug.description}
          <button onClick={() => dispatch(resolveBug(bug.id))}>Resolve</button>
        </li>
      ))}
    </ul>
  );
};

export default Bugs;
