/*---------------------------------SAMPLE USECASE----------------------------------------------------
A hypothetical usecase to show the usage of higher order function with function composition techniques 
to create business logic pipelines that drives business transactions. The techniques
involve creation of single responsibility functions and then combining them to get the desired 
results.

The design concepts explained here visualizes a multi-service/multi-component environment 
(microservices, SOA or modules within the same application). The demo here shows a very basic pub-sub 
based messaging system in action with the help function composition to create transaction pipelines.
-----------------------------------SAMPLE USECASE-----------------------------------------------------*/

import { compose } from './library';

/*----------------Basic business operations---------------------------------------*/

// Email creation operation
const createEmail: (firstName: string, lastName: string) => string = (firstName: string, lastName: string) => {
  console.log(`\nEmail Created: ${firstName}.${lastName}@lexmark.com`);
  console.log(`--------------------------------------------`);
  return `${firstName}.${lastName}@lexmark.com`;
};

// Announcement generator operation
const announcement: (message: string) => string = (message: string) => {
  console.log(`\nAn important announcement has been sent to all departments!`);
  console.log(`--------------------------------------------------------------------`);
  return `${message}!`;
};

// Email deletion operation
const deleteEmail: (email: string) => string = (email: string) => {
  console.log(`\nEmail Deleted: ${email}`);
  console.log(`--------------------------------------------`);
  return `Email ${email} deleted.`;
};

/*----------------------Messaging system setup-----------------------------------------*/

// Dummy messaging system which conveys important events to isolated systems
const MESSAGE_SERVICE = new (require('events'))();

// Message queues (Different service listen to these queues based on their needs)
const HR_QUEUE_NAME = 'HR_SERVICE: EMAIL_CREATED';
const FINANCE_QUEUE_NAME = 'FINANCE_SERVICE: EMAIL_CREATED';
const IT_QUEUE_NAME = 'IT_SERVICE: EMAIL_CREATED';
const RESEARCH_QUEUE_NAME = 'RESEARCH_SERVICE: EMAIL_CREATED';

// Specific event listener for multiple services in the services eco-system
const HR_SERVICE_LISTENER: (message: string) => void = (message: string): void => console.log(`HR SERVICE received message: ${message}`);
const FINANCE_SERVICE_LISTENER: (message: string) => void = (message: string): void => console.log(`FINANCE SERVICE received message: ${message}`);
const IT_SERVICE_LISTENER: (message: string) => void = (message: string): void => {
  console.log(`IT SERVICE received message: ${message}`);
  if ( message === 'malicious.user@lexmark.com') {
    let startAnnouncement = compose(HR_EVENT_DISPATCHER, IT_EVENT_DISPATCHER, FINANCE_EVENT_DISPATCHER, RESEARCH_EVENT_DISPATCHER, announcement);
    let startDeleteEmailTransaction = compose(IT_EVENT_DISPATCHER, HR_EVENT_DISPATCHER, deleteEmail);
    setTimeout(() => startAnnouncement(`SECURITY ALERT: The email address ${message} has been blocked due to security reasons`), 0);
    setTimeout(() => startDeleteEmailTransaction(`${message}`), 10000);
  }
};
const RESEARCH_SERVICE_LISTENER: (message: string) => void = (message: string): void => console.log(`R & D SERVICE received message: ${message}`);

// Register the service listeners to listen to interested queues
MESSAGE_SERVICE.addListener(HR_QUEUE_NAME, HR_SERVICE_LISTENER);
MESSAGE_SERVICE.addListener(FINANCE_QUEUE_NAME, FINANCE_SERVICE_LISTENER);
MESSAGE_SERVICE.addListener(IT_QUEUE_NAME, IT_SERVICE_LISTENER);
MESSAGE_SERVICE.addListener(RESEARCH_QUEUE_NAME, RESEARCH_SERVICE_LISTENER);

// Event dispatchers that post messages to the message queue when something interesting happens
const HR_EVENT_DISPATCHER: (fn: Function) => (...args: any[]) => any = (fn: Function) => (...args: any[]): any => {
  var result: any = fn(...args);
  setTimeout(() => MESSAGE_SERVICE.emit(HR_QUEUE_NAME, result), 1000);
  return result;
};

const FINANCE_EVENT_DISPATCHER: (fn: Function) => (...args: any[]) => any = (fn: Function) => (...args: any[]): any => {
  var result: any = fn(...args);
  setTimeout(() => MESSAGE_SERVICE.emit(FINANCE_QUEUE_NAME, result), 1000);
  return result;
};

const IT_EVENT_DISPATCHER: (fn: Function) => (...args: any[]) => any = (fn: Function) => (...args: any[]): any => {
  var result: any = fn(...args);
  setTimeout(() => MESSAGE_SERVICE.emit(IT_QUEUE_NAME, result), 1000);
  return result;
};

const RESEARCH_EVENT_DISPATCHER: (fn: Function) => (...args: any[]) => any = (fn: Function) => (...args: any[]): any => {
  var result: any = fn(...args);
  setTimeout(() => MESSAGE_SERVICE.emit(RESEARCH_QUEUE_NAME, result), 1000);
  return result;
};

// Required pipelines to drive business logic
export const startCreateEmailTransaction = compose(HR_EVENT_DISPATCHER, FINANCE_EVENT_DISPATCHER, IT_EVENT_DISPATCHER, createEmail);
export const startAnnouncement = compose(HR_EVENT_DISPATCHER, IT_EVENT_DISPATCHER, FINANCE_EVENT_DISPATCHER, RESEARCH_EVENT_DISPATCHER, announcement);
