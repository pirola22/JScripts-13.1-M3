import System;
import System.Collections;
import System.Windows.Controls;
import System.Web.UI.WebControls;
import System.Windows.Input;
import System.Windows.Media;
import Lawson.M3.MI;
import Mango.UI.Services.Lists;
import MForms;
import System.Windows.Threading;
import Mango.UI.Utils;
import Systems.Windows.Control.TextBlock;

import Mango.UI.Core;
import Mango.UI.Core.Util;
import Mango.UI.Services;

package MForms.JScript {
	class MMS470B {
		var convRate = 0.453; //2.2046;
		var listView;
		// adding a control to indicate when its converted
		//Set globals here
		//use hidden field to make sure conversion only happens once
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
		var field;
		var sort;
		var fields; // : String[] = new String[5];
		var lblConvert : Label = new Label();
		var msg = "Not Converted";
		var program;
		var ff;
		var txtFields;
		public function Init(element : Object, args : Object, controller : Object, debug : Object) {
			try {

				this.controller = controller;
				this.content = controller.RenderEngine.Content;

				this.debug = debug;
				program = controller.RenderEngine.PanelHeader;

				//theses 2 lines make the script wait until content is loaded
				var startDelegate : Action = MyStart;

				content.Dispatcher.BeginInvoke(DispatcherPriority.Background, startDelegate);
				// include both lines in every script
			} catch (ex : Exception) {}

		}
		function MyStart() {
			try {
				ff = new FontFamily("Arial");
				if (program == "MMS470/B") {

					listControl = controller.RenderEngine.ListControl;
					//pupolate list view
					this.listView = controller.RenderEngine.ListControl.ListView;
					this.rows = listView.Items;
					this.columns = listView.View.Columns;
					//end populate list view
					//add column
					var gvch = new GridViewColumnHeader();

					var gvc = new GridViewColumn();
					gvc.Header = gvch;
					gvc.CellTemplateSelector = new ListCellTemplateSelector(columns.Count, controller.RenderEngine.ListControl.Columns);
					columns.Add(gvc);
					//add column
					if (listView.ItemsSource != null) {

						rows = IList(listView.ItemsSource); // Use the ItemsSource to get data
					} else {

						rows = listView.Items; //Get the items
					}
					// logic
					//check sort order
					sort = controller.PanelState["WWQTTP"];
					switch (program) {

					case 'MMS470/B':
						fields = new String[1];
						fields[0] = "GWTM";
						break;

					}
					for (var i = 0; i < fields.length; i++) {

						columnIndex = listControl.GetColumnIndexByName(fields[i]);

						if (columnIndex == -1) {

							continue;
						} else {
							// check if the field exist
							//if it does send it to the calc method

							calc(0, rows.Count - 1, fields[i]);

						}
					}

				}
				listControl.ResizeColumns();
				oldCount = newCount = rows.Count;
				var typeScrollViewer : Type = Type.GetType("System.Windows.Controls.ScrollViewer, PresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35");
				this.scrollViewer = Helpers.FindElementOfType(listControl.ListView, typeScrollViewer);
				if (scrollViewer != null) {
					this.scrollViewer.add_ScrollChanged(OnScrollChanged);
				}
				var currentRowCount = rows.Count;
				controller.add_RequestCompleted(OnRequestCompleted);

			} catch (ex : Exception) {}
		}
		function calc(from, to, field) {

			try {
				listControl = controller.RenderEngine.ListControl;
				columnIndex = listControl.GetColumnIndexByName(field);
				var lbs : String = 0;
				for (var i = from; i <= to; i++) { //strt for
					// The new placeholder is in the list - add some datap
					//have to layover the onhand column
					var row = listView.Items[i];

					if (columnIndex != -1) {
						var kg = row.Item[columnIndex] * 1;
						var isNegative : boolean = false;
						var Skg : Object = new String(row.Item[columnIndex]);

						//check here

						if (isNaN(Skg)) {
							kg = parseFloat(Skg);
							isNegative = 1;
						} else {
							kg = row.Item[columnIndex] * 1;

						}
						//Per bobs request, rounding the weights to the nearest whole number.
						lbs = (kg / convRate).toFixed(3);

						var newItems = new String[row.Items.length + 1];

						row.Items.CopyTo(newItems, 0);

						if (isNegative) {

							newItems[columnIndex] = '-' + lbs +  "";

							isNegative = false;
						} else {

							newItems[columnIndex] = lbs;
						}
					}

					row.Items = newItems;
					// Replace row
					rows.RemoveAt(i);
					rows.Insert(i, row);
					
				}
			} catch (ex) {}
		}
		function OnScrollChanged(sender : Object, e : ScrollChangedEventArgs) {

			if (e.VerticalChange != 0) {
				oldCount = listView.Items.Count;
			} else {

				try {
					ff = new FontFamily("Arial");
					program = controller.RenderEngine.PanelHeader;
					if (program == "MMS470/B") {
						var newCount = listView.Items.Count;
						var diff : int = newCount - oldCount;
						var fromRow = oldCount;
						var toRow = listView.Items.Count - 1;

						if (diff > 0) {
							// logic
							//check sort order
							sort = controller.PanelState["WWQTTP"];
							switch (program) {
							case 'MMS470/B':
								fields = new String[1];
								fields[0] = "GWTM";
								break;
							}
							for (var i = 0; i < fields.length; i++) {
								columnIndex = listControl.GetColumnIndexByName(fields[i]);
								if (columnIndex == -1) {
									continue;
								} else {
									// check if the field exist
									//if it does send it to the calc method
									calc(fromRow, toRow, fields[i]);

								}
							}
							oldCount = newCount = rows.Count;
						}

					}

				} catch (ex : Exception) {}
			}
		}
		function OnRequestCompleted(sender : Object, e : RequestEventArgs) {

			try {
				var controller : MForms.InstanceController = sender;
				if (controller.RenderEngine == null) {
					var controller;
					content = null;
					debug = null;
					rows = null;
					columns = null;

					oldCount = 0,
					newCount = 0;
					listControl = null;
					columnIndex = null;
					// program is closing, cleanup
					//remove any objects
					scrollViewer.remove_ScrollChanged(OnScrollChanged);
					controller.remove_RequestCompleted(OnRequestCompleted);
					scrollViewer = null;
					controller = null;

				}
			} catch (ex : Exception) {}
		}
	}
}
