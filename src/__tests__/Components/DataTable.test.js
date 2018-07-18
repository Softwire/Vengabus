import { DataTable } from "../../Components/DataTable";
import renderer from 'react-test-renderer';
import React from 'react';
import { css } from 'react-emotion';
import Adaptor from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
configure({ adapter: new Adaptor() });

describe('DataTable', () => {

    function clickFunction(e, row, rowIndex) {
        console.log(row);
    }

    function getDataToDisplay() {
        return [{ number: 1, name: 'q1', status: 'active' }, { number: 2, name: 'q2', status: 'active' }, { number: 3, name: 'q3', status: 'dead' }];
    }

    function getColProps() {
        return [
            {
                dataField: "number",
                text: "Number",
                headerStyle: { width: "10%" }
            },
            {
                dataField: "name",
                text: "Name",
                headerStyle: { width: "50%" }
            },
            {
                dataField: "status",
                text: "Status",
                headerStyle: { width: "40%" }
            }
        ];
    }

    function getTableRowStyle() {
        const tableRowStyle = css`
    	          :hover {
    	              border: 2px solid grey;
    	              background-color: blue;
    	          }
              `;
        return tableRowStyle;
    }

    function getRowEvents() {
        return {
            onClick: clickFunction
        };
    }

    it('displays correctly from given props', () => {
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                rowEvents={getRowEvents()}
                tableRowStyle={getTableRowStyle()}
            />);
        expect(dataTable.toJSON()).toMatchSnapshot();
    });

    it('throws an error if onClick function is defined twice', () => {
        function getDataTable() {
            return mount(
                <DataTable
                    colProps={getColProps()}
                    dataToDisplay={getDataToDisplay()}
                    rowEvents={getRowEvents()}
                    tableRowStyle={getTableRowStyle()}
                    onRowClick={clickFunction}
                />);
        }
        expect(getDataTable).toThrow(new Error("Error: the row's onClick event is defined multiple times"));
    });

});