import { DataTable } from "../../Components/DataTable";
import renderer from 'react-test-renderer';
import React from 'react';
import { mount } from 'enzyme';

const rawConsoleError = console.error;
function suppressSpecificDataTableErrors() {
    // We use '...args' to ensure that we are passing all args on to the actual console.error()
    // Can't use 'arguments' because that doesn't exist in ES6 arrow funcs.
    console.error = (...args) => {
        const errorString = args[0];
        if (!errorString.startsWith('The above error occurred in the <DataTable> component')) {
            rawConsoleError(...args);
        }
    };
}
function resetConsoleError() {
    console.error = rawConsoleError;
}

beforeAll(suppressSpecificDataTableErrors);
afterAll(resetConsoleError);

describe('DataTable', () => {

    function getDataToDisplay() {
        return [{ number: 1, name: 'q1' }, { number: 2, name: 'q2' }, { number: 3, name: 'q3' }];
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
            }
        ];
    }

    it('renders without an error if only the required props are specified', () => {
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
            />);
    });

    it('renders correctly if an empty array is input as data', () => {
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={[]}
            />);
        expect(dataTable.toJSON()).toMatchSnapshot();
    });

    it('renders correctly with the selectRow prop', () => {
        const selectRow = {
            bgColor: 'green',
            selected: 0,
            onSelect: () => { return; }
        };
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={[]}
                selectRow={selectRow}
            />);
        expect(dataTable.toJSON()).toMatchSnapshot();
    });

    it('function is called correctly if only rowEvents is defined', () => {
        let spy = jest.fn();
        let wrapper = mount(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                rowEvents={{ onClick: spy }}
                tableRowStyle='row'
            />);
        let row = wrapper.find('.row').first();
        row.simulate('click');
        expect(spy).toBeCalled();
    });

    it('calls function correctly if only onRowClick is defined', () => {
        let spy = jest.fn();
        let wrapper = mount(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                onRowClick={spy}
                tableRowStyle='row'
            />);
        let row = wrapper.find('.row').first();
        row.simulate('click');
        expect(spy).toBeCalled();
    });

    it('calls click function correctly with both onRowClick and rowEvents defined', () => {
        let spy = jest.fn();
        let wrapper = mount(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                onRowClick={spy}
                rowEvents={{ onMouseEnter: function () { return; } }}
                tableRowStyle='row'
            />);
        let row = wrapper.find('.row').first();
        row.simulate('click');
        expect(spy).toBeCalled();
    });

    it('calls mouse enter function correctly with both onRowClick and rowEvents defined', () => {
        let spy = jest.fn();
        let wrapper = mount(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                onRowClick={function () { return; }}
                rowEvents={{ onMouseEnter: spy }}
                tableRowStyle='row'
            />);
        let row = wrapper.find('.row').first();
        row.simulate('mouseEnter');
        expect(spy).toBeCalled();
    });

    it('calls onSelect function correctly', () => {
        let spy = jest.fn();
        let wrapper = mount(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                tableRowStyle='row'
                selectRow={{ onSelect: spy }}
            />);
        let row = wrapper.find('.row').first();
        row.simulate('click');
        expect(spy).toBeCalled();
    });

    it('throws a descriptive error if onClick function is defined twice', () => {
        function getDataTable() {
            return mount(
                <DataTable
                    colProps={getColProps()}
                    dataToDisplay={getDataToDisplay()}
                    rowEvents={{ onClick: function () { return; } }}
                    onRowClick={function () { return; }}
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

    it('throws a descriptive error if background color may be multiply defined on selectRow', () => {
        function getDataTable() {
            return mount(
                <DataTable
                    colProps={getColProps()}
                    dataToDisplay={getDataToDisplay()}
                    selectRow={{ bgColor: 'green', classes: 'selectrow' }}
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('background color of selected row may be multiply defined in test'));
        function getDataTable2() {
            return mount(
                <DataTable
                    colProps={getColProps()}
                    dataToDisplay={getDataToDisplay()}
                    selectRow={{ bgColor: 'green', style: {} }}
                    name='test'
                />);
        }
        expect(getDataTable2).toThrow(new Error('background color of selected row may be multiply defined in test'));
    });

});