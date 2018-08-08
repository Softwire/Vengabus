import { DataTable } from "../../Components/DataTable";
import renderer from 'react-test-renderer';
import React from 'react';
import { mount } from 'enzyme';
import { css } from 'emotion';

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
        return [{ dataField: "number", text: 'Number' }, { dataField: "name", text: 'Name' }];
    }

    it('renders without an error if only the required props are specified', () => {
        renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                keyColumn='number'
            />);
    });

    it('renders correctly if an empty array is input as data', () => {
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={[]}
                keyColumn='number'
            />);
        expect(dataTable.toJSON()).toMatchSnapshot();
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    it('renders correctly with the selectRow prop', () => {
        const selectRow = {
            bgColor: 'green',
            selected: 0,
            onSelect: () => { return; }
        };
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                selectRow={selectRow}
                keyColumn='number'
            />);
        expect(dataTable.toJSON()).toMatchSnapshot();
    });

    it('renders correctly when defaultHover=true with an additional rowClasses prop', () => {
        const rowClasses = css`
                    background-color: grey;
              `;
        let dataTable = renderer.create(
            <DataTable
                colProps={getColProps()}
                dataToDisplay={getDataToDisplay()}
                rowClasses={rowClasses}
                keyColumn='name'
                defaultHover
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
                rowClasses='row'
                keyColumn='number'
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
                rowClasses='row'
                keyColumn='number'
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
                rowClasses='row'
                keyColumn='number'
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
                rowClasses='row'
                keyColumn='number'
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
                rowClasses='row'
                selectRow={{ onSelect: spy }}
                keyColumn='number'
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
                    keyColumn='number'
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
                    keyColumn='number'
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
                    keyColumn='number'
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
                    keyColumn='number'
                />);
        }
        expect(getDataTable2).toThrow(new Error('background color of selected row may be multiply defined in test'));
    });

    it('throws a descriptive error if missing a width definition', () => {
        let colProps = getColProps();
        colProps[0].width = 90;
        function getDataTable() {
            return mount(
                <DataTable
                    dataToDisplay={getDataToDisplay()}
                    colProps={colProps}
                    keyColumn='number'
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('missing column width definition in test:name'));
    });

    it('throws a descriptive error if overall defined width is not 100%', () => {
        let colProps = getColProps();
        colProps[0].width = 90;
        colProps[1].width = 9;
        function getDataTable() {
            return mount(
                <DataTable
                    dataToDisplay={getDataToDisplay()}
                    colProps={colProps}
                    keyColumn='number'
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('overall width of columns is not 100% in test'));
    });

    it('throws a descriptive error if width is defined in the header style', () => {
        let colProps = getColProps();
        colProps[1].headerStyle = { width: '50%' };

        function getDataTable() {
            return mount(
                <DataTable
                    dataToDisplay={getDataToDisplay()}
                    colProps={colProps}
                    keyColumn='number'
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('width of column should not be specified in the style (in test:name)'));
    });

    it('throws a descriptive error if no or invalid key column', () => {
        function getDataTable() {
            return mount(
                <DataTable
                    dataToDisplay={getDataToDisplay()}
                    colProps={getColProps()}
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('need a valid keyColumn in test'));
        function getDataTable2() {
            return mount(
                <DataTable
                    dataToDisplay={getDataToDisplay()}
                    colProps={getColProps()}
                    keyColumn='invalid'
                    name='test'
                />);
        }
        expect(getDataTable2).toThrow(new Error('need a valid keyColumn in test'));
    });

    it('throws a descriptive error if key column is not unique', () => {
        function getDataTable() {
            return mount(
                <DataTable
                    dataToDisplay={[...getDataToDisplay(), { number: 4, name: 'q1' }]}
                    colProps={getColProps()}
                    keyColumn='name'
                    name='test'
                />);
        }
        expect(getDataTable).toThrow(new Error('key column specified in test is not unique'));
    });

});