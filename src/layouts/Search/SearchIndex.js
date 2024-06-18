// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import React, { useState } from "react";
import MySearchList from "./search/MySearchList";

export default function search() {

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MySearchList />

    </DashboardLayout >
  );
}

