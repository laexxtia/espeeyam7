# All-In-One Internal Skill-based Role Portal

This projects provides staff with an avenue to conveniently source and apply for roles within the organisation. The respective hiring managers and HR administrative are also given the means to find suitable candidates for their positions within All-In-One.


## Table of Contents
- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Testing](#testing)

## Description

Currently at All-In-One, the only point of reference for staff to view and apply for other internal roles is an email blast to all staff containing the open roles and generic job descriptions. Following this email blast, staff then manually contact HR and state their intentions with their information and their current skill set.

The All-In-One Internal Skill-based Role Portal streamlines this primitive application process by automatically displaying open roles and job descriptions through a web-based application. Here are some examples of process improvements enabled by the Internal Role Portal:
- HR administrators and the relevant hiring manager can view the personal information and skill set of each staff member through the portal, granting these parties access to these details without the need for staff to manually describe said information.
- Job application is done in-application, eliminating the need for staff to manually get in touch with HR to express interest in the role.
- Candidates which apply for each role are available to the respective hiring manager/HR administrator. Hence, HR administrators and hiring managers no longer need to manually compile information and sort by role.

[Return to Table of Contents](#table-of-contents)

## Features

Some key features of the portal include:

<table border='1'>
  <tr>
    <th>Feature</th>
    <th>Applicable Parties</th>
    <th>Description</th>
  </tr>

  <tr>
    <td>Role-skill Match (%)</td>
    <td>
      <ul>
        <li>Staff</li>
        <li>HR administrators and hiring managers</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>
          <b>Visible to staff:</b> Comparing personal skill sets with skill sets required by open roles.
        </li>
        <li>
          <b>Visible to HR and hiring managers:</b> Comparing skill sets of candidates with skill sets required by open roles.
        </li>
      </ul>
    </td>
  </tr>

  <tr>
    <td>Job Filter</td>
    <td rowspan='3'>Staff</td>
    <td>Allows staff to filter jobs on the homepage based on skills required by the job (in a single- or multi-select fashion).</td>
  </tr>

  <tr>
    <td>Applied Jobs Function</td>
    <td>Consolidates all roles that staff has submitted an application to.
    </td>
  </tr>

  <tr>
    <td>Date-responsive Application Deadline</td>
    <td>Shows date up till 2359 of deadline, and displays, "Applications closed" text after deadline has passed.
        <br><br>
        Once application deadline has passed, jobs are no longer visible on the homepage (but remain on the Applied Jobs page) and the "Apply Now" button is removed if the staff member views the role from the Applied Jobs page.
    </td>
  </tr>

  <tr>
    <td>Creating New Listings</td>
    <td>HR administrators and hiring managers</td>
    <td>Allows users to create new job listings through custom user inputs into fields (i.e. job title, job description, department, skills required, application deadline).
    </td>
  </tr>
</table>

[Return to Table of Contents](#table-of-contents)

## Installation

The installation instructions are as follows:

1. Clone the repository:

   ```sh
   git clone https://github.com/laexxtia/espeeyam7.git
   ```

2. Open the repository locally and add the config.js (consists of your Firebase configuration) file to the config folder.

3. In the terminal in your IDE, write the following command:

   ```sh
   node server.js
   ```

4. A <u>link</u> should be returned in the terminal. Click it and you're ready to go!

[Return to Table of Contents](#table-of-contents)

## Testing

Our test case file is login.test.js. Please make sure to complete the steps in [Installation](#installation) before testing. To run it, write the following command in your IDE terminal:

   ```sh
   npx jest
   ```

[Return to Table of Contents](#table-of-contents)
