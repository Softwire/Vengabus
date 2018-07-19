import { DataTable } from "../../Components/DataTable";
import renderer from 'react-test-renderer';
import React from 'react';
import Adaptor from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
configure({ adapter: new Adaptor() });

describe('DataTable', () => {

    function clickFunction(e, row, rowIndex) {
        return;
    }

    function getDataToDisplay() {
        return [{ number: 1, name: 'q1', status: 'active' }, { number: 2, name: 'q2', status: 'active' }, { number: 3, name: 'q3', status: 'dead' }];
    }

    function getColProps() {
        return [
            {
                dataField: "number",
                text: "Number"
            },
            {
                dataField: "name",
                text: "Name"
            },
            {
                dataField: "status",
                text: "Status"
            }
        ];
    }

    function getRowEvents() {
        return {
            onClick: clickFunction
        };
    }

    it('renders correctly if only the required props are specified', () => {
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
            />);
        expect(dataTable.toJSON()).toMatchSnapshot();
    });

    it('renders correctly if an empty array is input as data', () => {
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={[]}
            />);
        expect(dataTable.toJSON()).toMatchSnapshot();
    });

    it('renders correctly if only rowEvents is defined', () => {
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                rowEvents={getRowEvents()}
            />);
        expect(dataTable.toJSON()).toMatchSnapshot();
    });

    it('renders correctly if only onRowClick is defined', () => {
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                onRowClick={clickFunction}
            />);
        expect(dataTable.toJSON()).toMatchSnapshot();
    });

    it('renders correctly with both onRowClick and rowEvents', () => {
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                onRowClick={clickFunction}
                rowEvents={{ onHover: clickFunction }}
            />);
        expect(dataTable.toJSON()).toMatchSnapshot();
    });

    it('throws a descriptive error if onClick function is defined twice', () => {
        function getDataTable() {
            return mount(
                <DataTable
                    colProps={getColProps()}
                    dataToDisplay={getDataToDisplay()}
                    rowEvents={getRowEvents()}
                    onRowClick={clickFunction}
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('the onClick event for rows is defined multiple times in test'));
    });

    it('throws a descriptive error if colProps is missing', () => {
        function getDataTable() {
            return mount(
                <DataTable
                    dataToDisplay={getDataToDisplay()}
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('column property object is not defined in test'));
    });

    it('throws a descriptive error if colProps.dataField is missing', () => {
        function getDataTable() {
            const badColProps = [
                { text: 'Number' },
                { text: 'Name' },
                { text: 'Status' }
            ];
            return mount(
                <DataTable
                    colProps={badColProps}
                    dataToDisplay={getDataToDisplay()}
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('colProps.dataField is undefined in test, cannot determine what data to display in which column.'));
    });

    it('throws a descriptive error if colProps.text is missing', () => {
        function getDataTable() {
            const badColProps = [
                { dataField: 'number' },
                { dataField: 'name' },
                { dataField: 'status' }
            ];
            return mount(
                <DataTable
                    colProps={badColProps}
                    dataToDisplay={getDataToDisplay()}
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('colProps.text is undefined in test, cannot determine header text of columns.'));
    });

});