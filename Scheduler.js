import System;
/* 'Double'  'Exception'  'Action'   'Uri'   */
import System.Collections; //'IList'
import System.Windows.Controls;
/*'Button'  'GridViewColumnHeader' 'GridViewColumn' 'Grid'  */
import Mango.UI.Services.Lists; //'ListCellTemplateSelector'
import MForms;
import System.Windows.Threading;
import Mango.UI.Services; // 'DashboardTaskService'
import System.Windows; //'RoutedEventArgs'
import Mango.Services; //'ApplicationServices
import System.Windows.Forms;
import System.ComponentModel;
import System.Drawing;
import System.Collections.Generic;
import System.Diagnostics;
import System.Globalization;
import System.Reflection;
import System.Text;
import System.Xml;
import System.Windows.Media;
import log4net;

import Mango.UI.Core.Util;

package MForms.JScript {
	class Scheduler extends System.Windows.Forms.Form {
		var newItems;
		var listView;
		var controller;
		var content;
		var debug : Object;
		var rows : IList;
		var columns : System.Windows.Controls.GridViewColumnCollection;
		var scrollViewer : System.Windows.Controls.ScrollViewer;
		var oldCount : Double = 0,
		newCount : Double = 0;
		var listControl;
		var columnIndex;
		var sort;
		var button : Button = new Button();
		var btnContent = 'Schedule';
		var btnName = "ComActScheduler";
		var mfnoColName = 'MFHL';
		var prnoColName = 'PRNO';
		var opnoColName = 'OPNO';
		var whstColName = 'WHST';
		var isPortletOpen : boolean = false;
		var previousPortlet;
		var qa3 = "QA3";
		var port;
		var tst = "test";
		var url;
		var status : String;
		var id : String
		public function Init(element : Object, args : Object, controller : Object, debug : Object) {
			try {
				this.controller = controller;
				this.content = controller.RenderEngine.Content;
				this.debug = debug;
				//theses 2 lines make the script wait until content is loaded
				var startDelegate : Action = MyStart;
				content.Dispatcher.BeginInvoke(DispatcherPriority.Background, startDelegate);
				// include both lines in every script
			} catch (ex : Exception) {}
		}
		function MyStart() {
			try {
				listControl = controller.RenderEngine.ListControl;
				//pupolate list view
				this.listView = controller.RenderEngine.ListControl.ListView;
				this.rows = listView.Items;
				this.columns = listView.View.Columns;
				//end populate list view

				//Setting button properties
				button.Content = btnContent;
				button.Name = btnName;
				Grid.SetColumnSpan(button, 10);
				Grid.SetRowSpan(button, 3);
				Grid.SetColumn(button, 50);
				Grid.SetRow(button, 1);
				//Adding button
				content.Children.Add(button);
				//Adding event listeners
				button.add_Click(OnClick);
				controller.add_Requested(OnRequested);
				controller.add_Requesting(OnRequesting);
			} catch (ex : Exception) {}
		}
		public function OnClick(sender : Object, e : RoutedEventArgs) {
			//Once clicked the button calls this method to gather info
			getSelectedRow();
		}

		public function OnRequested(sender : Object, e : RequestEventArgs) {
			try {
				var controller : MForms.InstanceController = sender;
				if (controller.RenderEngine == null) {
					// program is closing, clean-up
					//remove any objects
					button.remove_Click(OnClick);
					controller.remove_Requested(OnRequested);
					controller.remove_Requesting(OnRequesting);
					controller = null;
				}
			} catch (ex : Exception) {}
		}
		public function OnRequesting(sender : Object, e : CancelRequestEventArgs) {
			//Adding event check to close window after user presses enter
			if (e.CommandValue == "ENTER") {
				closeOpenWindows();
			}
				//Adding event check to close window after user Refreshes screen
			if (e.CommandValue == "F5") {
				closeOpenWindows();
			}
				//Adding event check to close window after user Closes application
			if (e.CommandValue == "F12") {
				closeOpenWindows();
			}
			//Adding event check to close window after user cancels
			if (e.CommandValue == "F03") {
				closeOpenWindows();
			}
			//Adding event check to close window after user clicks on next page
				if (e.CommandValue == "5") {
				closeOpenWindows();
			}
		}
		function closeOpenWindows() {

			var ComActPortlet : Uri = new Uri(previousPortlet);

			var runner : IRunner;
			if (isPortletOpen) {
				//DashboardTaskService.Manager.CloseTask(previousPortlet);
				var results2 = DashboardTaskService.Manager.FindRunningTaskByUri(previousPortlet, TaskMatch.Exact);

				//Iterating through open portlets and closing them
				for (var results : FindTaskResult in results2) {
					//Getting the ID for the open portlet
					id = results.UniqueId;
					//Getting the runner for the portlet
					runner = DashboardTaskService.Manager.GetRunnerById(id);
					//Closing the last portlet opened
					DashboardTaskService.Manager.CloseTask(runner);
				}
				isPortletOpen = false;
			}
		}
		function getSelectedRow() {
			try {
				var mfnoIndex;
				//Getting Sort order
				var sortOrder = controller.RenderEngine.InquiryType;
				//Getting The the info from the row selected
				listControl = controller.RenderEngine.ListControl;
				//getting index for MFNO
				var envString = ApplicationServices.SystemProfile.Name;
				switch (envString) {
				case 'TST':
					port = "9090";
					url = "http://172.16.64.54";
					break;
				case 'QA1':
					port = "1010";
					url = "http://172.16.64.53";
					break;
				case 'QA2':
					port = "2020";
					url = "http://172.16.64.53";
					break;
				case 'QA3':
					port = "3030";
					url = "http://172.16.64.53";
					break;
				case 'QA4':
					port = "4040";
					url = "http://172.16.64.53";
					break;
				case 'QA5':
					port = "5050";
					url = "http://172.16.64.53";
					break;
				case 'PRD':
					port = "8080";
					url = "http://172.16.64.53";
					break;
				}
				mfnoIndex = listControl.GetColumnIndexByName("MFNO");
				//Getting index for PRNO
				var prnoIndex = listControl.GetColumnIndexByName("PRNO");
				//Getting the row selected
				var SelectedRowNumber : int = listView.SelectedIndex;
				//Setting the row to equal the row clicked
				var row = listView.Items[SelectedRowNumber];
				//Getting Values from the row selected
				var plgrIndex = listControl.GetColumnIndexByName("PLGR");
				var mfnoValue = row[mfnoIndex];
				var prnoValue = row[listControl.GetColumnIndexByName(prnoColName)];
				var plgrValue = ScriptUtil.FindChild(content, "WWPLGR").Text;
				status = row[listControl.GetColumnIndexByName(whstColName)];
				//Calling launchingSite method to open the Portlet
				if (status.substring((status.length - 1), status.length) != 2) {
					launchSite(plgrValue, prnoValue, mfnoValue);
				} else {
					controller.RenderEngine.ShowMessage("Order status is " + status + ", change is not permitted");
				}
			} catch (ex) {}
		}
		function launchSite(plgr, prno, mfno) {
			var startTask = 'Manufacturing/BatchCardCreation/';
			var password : String;
			var userName : String;
			//Getting userName
			//This method calls for &username, and &password paramet to be passed but works with just the username.
			ApplicationServices.UserContext.RequestCredentials("M3", "MForms",  & userName,  & password);
			var program = url + ':' + port + '/comactivity/portal/?'
				 + 'userid=' + userName
				 + '&_startTask=manufacturing/BatchCardCreation'
				 + '&_mapdataMOVEX_MWOOPE_VOPRNO=' + prno
				 + '&_mapdataMOVEX_MWOOPE_VOMFNO=' + mfno
				 + '&_mapdataMOVEX_MWOOPE_VOPLGR=' + plgr
				 + '&_mapdataMOVEX_USER=' + userName
				//creating Uri for ComAct Portlet
				var ComActPortlet : Uri = new Uri(program);
			var id : String
			var runner : IRunner;
			// this is how to get the portlet count
			// var m = DashboardTaskService.Current.FindRunningTaskByUri(program,TaskMatch.Exact).Count;
			//checking to see if theres an open portlet
			if (isPortletOpen) {
				//Iterating through open portlets and closing them
				for (var results : FindTaskResult in DashboardTaskService.Manager.FindRunningTaskByUri(previousPortlet, TaskMatch.Exact)) {
					//Getting the ID for the open portlet
					id = results.UniqueId;
					//Getting the runner for the portlet
					runner = DashboardTaskService.Manager.GetRunnerById(id);
					//Closing the last portlet opened
					DashboardTaskService.Manager.CloseTask(runner);
				}
				//after all open portlets are close  I start a new one
				DashboardTaskService.Manager.LaunchTask(ComActPortlet);
				// im setting the previous portlet to the current portlet
				previousPortlet = ComActPortlet;
			} else {
				//if theres no portlet open The selected one will start
				DashboardTaskService.Manager.LaunchTask(ComActPortlet);
				// setting isPortletOpen to true
				isPortletOpen = true;
				//setting previousPortlet
				previousPortlet = ComActPortlet;
			}

		}
	}
}
