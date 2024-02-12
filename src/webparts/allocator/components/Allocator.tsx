import * as React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "@fortawesome/fontawesome-free/css/all.min.css"
import { Routes, Route, HashRouter } from 'react-router-dom';
import Header from './common/Header';
import './webpartStyle.css'
import Allocation from './allocation/Allocation';
import Employee from './Employees/Employee';
import Projects from './Projects/Projects';
import ProjectEdit from './allocation/ProjectEdit';
import ProjectNonEdit from './allocation/ProjectNonEdit';
import EmployeeAction from './allocation/EmployeeAction';
import { IAllocatorProps } from './IAllocatorProps';
import ConsolidatedReport from './ConsolidatedReport/ConsolidatedReport';
import BenchReport from './allocation/BenchReport';
import Client from './Client/Client';
import QuickReport from './QuickReports/QuickReport';

const Allocator: React.FunctionComponent<IAllocatorProps> = (props: any) => {

  return (
    <div className='allocator-root'>
      <HashRouter>
        <Header description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''}  context={props.context} webURL={props.webURL} />
        <Routes>
          <Route path='/' element={<Allocation description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} context={props.context} webURL={props.webURL} />} />
          <Route path='/Allocation' element={<Allocation description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} context={props.context} webURL={props.webURL} />} />
          <Route path='/QuickReport' element={<QuickReport description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} context={props.context} webURL={props.webURL} />} />
          <Route path='/Client' element={<Client description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} context={props.context} webURL={props.webURL} />} />
          <Route path='/employee' element={<Employee description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} context={props.context} webURL={props.webURL} />} />
          <Route path='/Projects' element={<Projects description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} context={props.context} webURL={props.webURL} />} />
          <Route path='/ProjectEdit/:id' element={<ProjectEdit description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} context={props.context} webURL={props.webURL} />} />
          <Route path='/ProjectNonEdit/:id' element={<ProjectNonEdit description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} context={props.context} webURL={props.webURL} />} />
          <Route path='/EmployeeAction/:id' element={<EmployeeAction description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} webURL={props.webURL} context={props.context} />} />
          <Route path='/ConsolidatedReport' element={<ConsolidatedReport description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} webURL={props.webURL} context={props.context} />} />
          <Route path='/BenchReport' element={<BenchReport description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} webURL={props.webURL} context={props.context} />} />
        </Routes>
      </HashRouter>
    </div>
  )
}

export default Allocator
