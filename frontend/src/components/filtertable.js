import React, { Component } from "react";
import { Table } from "antd";
import "./filtertable.css"


class FilterTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      needsupdate: true,
      updateColumns: false,
      dataSource: [],
      columns: [],
      buttondisabled: false,
      api: this.props.api
    };
  }

  // Function that allows for filtering the table data
  filterData = (data, key) => {
    const colData = [...new Set(data.map(item => item[key]))]; // trick to get unique values out
    return colData.map(item => ({
      text: item,
      value: item,
    }));
  };

  // Function that allows for sorting the table data
  makeSorter = (key) => {
    function sorter(a, b) {
      if (key === 'Number') {
        return a[key] - b[key]
      } else {
        const s1 = a[key] === null ? '+' : a[key];
        const s2 = b[key] === null ? '+' : b[key];
        return s1.localeCompare(s2)
      }
    };
    return sorter
  };

  // After receiving the data, this function updates the colums to allow for filtering
  // and sorting.
  updateColumns = () => {
    const cols = this.state.columns.map(item => ({
      title: item.title,
      dataIndex: item.dataIndex,
      key: item.key,
      sortDirections: ['ascend', 'descend'],
      filters: this.filterData(this.state.dataSource, item.key),
      onFilter: (value, record) => record[item.key].indexOf(value) === 0,
      sorter: (a, b) => this.makeSorter(item.dataIndex)(a, b),
    }));
    this.setState({
      columns: cols,
      updateColumns: false
    })
  };

  // Query the server for the data to be displayed
  async getData() {
    const data = await fetch(this.props.api + "/getsubmissions");
    const response = await data.json();
    this.setState({
      needsupdate: false,
      dataSource: response.dataSource,
      columns: response.columns,
      updateColumns: true
    });
  }

  // If the Project is "Julia Meetup", the row is highlighted in red.
  setColor = (record) => {
    if (record.Project === "Julia Meetups") {
      return "red-highlight";
    }
  };

  render() {
    if (this.state.needsupdate) {
      this.getData();  // Fetch the data.
    }
    if (this.state.updateColumns && !this.state.needsupdate) {
      this.updateColumns();  // When the data has arrived, add the sorting and filtering
    }
    return (
      <Table dataSource={this.state.dataSource}
        columns={this.state.columns}
        pagination={{
          pageSizeOptions: ["50", "100", "250"],
          showSizeChanger: true,
          defaultPageSize: 50
        }}
        rowClassName={(record) => this.setColor(record)} />
    );
  }
}

export default FilterTable;
