import System;
import System.Collections;
import System.Windows.Controls;
import System.Windows.Input;
import System.Windows.Media;
import Lawson.M3.MI;
import Mango.UI.Services.Lists;
import MForms;
import System.Windows.Threading;
import Mango.UI.Utils;
package MForms.JScript {
	class mms310_B_STQT {
		var convRate = 0.453; //2.2046;
		var listView;
		
		//Set globals here
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
		public function Init(element : Object, args : Object, controller : Object, debug : Object) {
			try {
				this.controller = controller;
				this.content = controller.RenderEngine.Content;
				this.debug = debug;
				//theses 2 lines make the script wait until content is loaded
				var startDelegate : Action = MyStart;
				content.Dispatcher.BeginInvoke(DispatcherPriority.Background, startDelegate);
				// include both lines in every script
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
		}
		function MyStart() {
			try {
				listControl = controller.RenderEngine.ListControl;
				columnIndex = listControl.GetColumnIndexByName('STQT');
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
					debug.WriteLine("New version of ListView");
					rows = IList(listView.ItemsSource); // Use the ItemsSource to get data
				} else {
					debug.WriteLine("Old version of ListView");
					rows = listView.Items; //Get the items
				}
				// logic
				calc(0, rows.Count - 1);
				
				//end logic
				oldCount = newCount = rows.Count;
			
					var typeScrollViewer : Type = Type.GetType("System.Windows.Controls.ScrollViewer, PresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35");
				scrollViewer = Helpers.FindElementOfType(listControl.ListView, typeScrollViewer);
				if (scrollViewer != null) {
			this.scrollViewer.add_ScrollChanged(OnScrollChanged);
			
			 
			}
			
			var currentRowCount = rows.Count;
				controller.add_RequestCompleted(OnRequestCompleted);
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
		}
		function calc(from, to) {
			try {
				listControl = controller.RenderEngine.ListControl;
				columnIndex = listControl.GetColumnIndexByName('STQT');
				var lbs : String = 0;
		
						
				for (var i = from; i <= to; i++) { //strt for
					// The new placeholder is in the list - add some datap
					//have to layover the onhand column
					var row = listView.Items[i];
					
					var UM = row[listControl.GetColumnIndexByName('UNMS')];
					debug.WriteLine("in calc" + listControl.GetColumnIndexByName('UNMS'));
					if (UM == 'KG') {
						var kg = row.Item[columnIndex] * 1;
						var isNegative : boolean = false;
						var Skg : Object = new String(row.Item[columnIndex]);
						var colorLbs : Object = new String("");
						//check here
						
						if (isNaN(Skg)) {
							kg = parseInt(Skg);
							isNegative = 1;
						} else {
							kg = row.Item[columnIndex] * 1;
							
						}
						//end check
						colorLbs = Skg.fontcolor("red");
						lbs = (kg /  convRate).toFixed(3);
						
						var newItems = new String[row.Items.length + 1];
						
						row.Items.CopyTo(newItems, 0);
						newItems[listControl.GetColumnIndexByName('UNMS')] = 'LB';
						
						if (isNegative) {
							
							newItems[columnIndex] = lbs + '-' + "";
							
							isNegative = false;
						} else { // if UNMS is not KG
							lbs.Foreground = Brushes.Red;
							newItems[columnIndex] = lbs;
							
						}
			
						
					} else {
						
						var newItems = new String[row.Items.length + 1];
						var val = row[listControl.GetColumnIndexByName('STQT') * 1];
						
						isNegative = false;
						Skg = new String(row[listControl.GetColumnIndexByName('STQT') * 1]);
						//check here
						
						if (isNaN(Skg)) {
							val = parseInt(Skg);
							isNegative = 1;
						} else {
							val = (row[listControl.GetColumnIndexByName('STQT') * 1] * 1).toFixed(3);
						
						}
						if (isNegative) {
							val = Skg + '-';
							newItems[listControl.GetColumnIndexByName('STQT') * 1] = Skg + '-';
							isNegative = false;
						} else {
							newItems[listControl.GetColumnIndexByName('STQT') * 1] = Skg + '';
							
						}
						//end check
						
						
						row.Items.CopyTo(newItems, 0);
						
						
					}
					
					if (UM == 'LB') {}
					row.Items = newItems;
					// Replace row
					rows.RemoveAt(i);
					rows.Insert(i, row);
			
					
				}
			}catch(ex){
			
			}
			}
			function OnScrollChanged(sender : Object, e : ScrollChangedEventArgs) {
				if (e.VerticalChange != 0) {
					oldCount = listView.Items.Count;
				} else {
					var newCount = listView.Items.Count;
					var diff : int = newCount - oldCount;
					var fromRow = oldCount;
					var toRow = listView.Items.Count - 1;
					if (diff > 0) {
						calc(fromRow, toRow);
					}
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
						debug.WriteLine("Clean-Up");
					}
				} catch (ex : Exception) {
					debug.WriteLine(ex);
				}
			}
		}
	}
