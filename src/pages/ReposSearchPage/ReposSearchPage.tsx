import React from "react";

import Button from "components/Button";
import Input from "components/Input";
import ReposContext from "components/ReposContext/ReposContext";
import SearchIcon from "components/SearchIcon";
import styles from "styles/style.module.scss";
import { Meta } from "utils/meta";
import { useLocalStore } from "utils/useLocalStore";
import { observer } from "mobx-react-lite";
import { Redirect, Route, Switch } from "react-router-dom";
import ReposListPage from "pages/ReposListPage";
import UserRepoPage from "pages/UserRepoPage";
import ReposListStore from "store/ReposListStore";

const ReposSearchPage: React.FC = () => {
  const reposListStore = useLocalStore(() => new ReposListStore());

  const [value, onChange] = React.useState("");

  const handleSearch = () => {
    if (!value) return
    reposListStore.getOrganizationReposList({
      orgName: value,
    });
    onChange("")
  };

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    []
  );

  React.useEffect(() => {
    reposListStore.getOrganizationReposList({ orgName: value });
  }, [reposListStore]);

  return (
      <div className={styles.wrapper}>
        <div className={styles.search}>
          {reposListStore.meta !== Meta.loading && (
            <Input
              value={value}
              placeholder={"Введите название организации"}
              onChange={handleChange}
            />
          )}

          {reposListStore.meta === Meta.loading && (
            <Input
              value={value}
              placeholder={"Введите название организации"}
              onChange={handleChange}
              isDisabled={true}
            />
          )}

          {reposListStore.meta !== Meta.loading && (
            <Button disabled={false} onClick={handleSearch}>
              <SearchIcon />
            </Button>
          )}

          {reposListStore.meta === Meta.loading && (
            <Button disabled={true} onClick={handleSearch}>
              <SearchIcon />
            </Button>
          )}
        </div>

        <Switch>
          <Route exact path="/repos/:id" component={UserRepoPage} />
          <ReposContext reposListStore={reposListStore}>
            <Route exact path="/repos" component={ReposListPage} />
            <Redirect to="/repos" />
          </ReposContext>
        </Switch>
      </div>
  );
};

export default observer(ReposSearchPage);
