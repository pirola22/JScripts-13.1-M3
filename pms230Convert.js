import System;
import System.Windows;
import System.Windows.Controls;
import System.Windows.Data;
import System.Windows.Media;
import System.Windows.Markup;
import System.Windows.Threading;
import MForms;
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
 
   public class pms230Convert {
     
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
		var selector : CustomTemplateSelector = null;
		var columnIndex;
      public function Init(element : Object, args : Object, controller : Object, debug : Object) {
         this.controller = controller;
         this.debug = debug;
         var action : Action = ChangeTemplate;
         Application.Current.Dispatcher.BeginInvoke(DispatcherPriority.Input, action);
      }
 
      private function ChangeTemplate() {
        var columnIndex =6;
         var bindingPath = "[" + columnIndex + "]";
         var brush;
         var listView = controller.RenderEngine.ListControl.ListView;
 
         var selector = new CustomTemplateSelector();
         selector.columnIndex = 0;
         selector.templateRed = CreateForegroundCellTemplate(bindingPath, "#FFCC0000");
           selector.templateGreen = CreateForegroundCellTemplate(bindingPath, "#FF00CC00");
		     selector.templateBlack = CreateForegroundCellTemplate(bindingPath, "#FF000001");
 try {
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
				
				calc(1, rows.Count - 1, 'MAQT');
				calc(1, rows.Count - 1, 'RVQT'); 
				oldCount = newCount = rows.Count;

				var typeScrollViewer : Type = Type.GetType("System.Windows.Controls.ScrollViewer, PresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35");
				scrollViewer = Helpers.FindElementOfType(listControl.ListView, typeScrollViewer);
				if (scrollViewer != null) {
					this.scrollViewer.add_ScrollChanged(OnScrollChanged);

				}

				var currentRowCount = rows.Count;
				controller.add_RequestCompleted(OnRequestCompleted);
			} catch (ex : Exception) {}
       
         listView.Items.Refresh();
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
						var kg = row.Item[columnIndex] * 1;
						var isNegative : boolean = false;
						var Skg : Object = new String(row.Item[columnIndex]);
						var colorLbs : Object = new String("");
						//check here

						if (isNaN(Skg)) {
							kg = parseFloat(Skg);
							isNegative = 1;
						} else {
							kg = row.Item[columnIndex] * 1;

						}
						//end check
						lbs = (kg / convRate).toFixed(3);
						if(kg == 0.00){
							lbs = "";
						}
						var newItems = new String[row.Items.length + 1];
						row.Items.CopyTo(newItems, 0);
						if (isNegative) {
							newItems[columnIndex] = lbs + '-' + "";
							isNegative = false;
						} else { // if UNMS is not KG
							lbs.Foreground = Brushes.Red;
							newItems[columnIndex] = lbs;
						}

				 
					row.Items = newItems;
					// Replace row
					rows.RemoveAt(i);
					rows.Insert(i, row);
					 
				}
			} catch (ex) {}
		}
			function OnScrollChanged(sender : Object, e : ScrollChangedEventArgs) {

			if (e.VerticalChange > 0) {
				oldCount = listView.Items.Count;
			} else {

				var newCount = listView.Items.Count;
				var diff = newCount - oldCount;
				var fromRow = oldCount;
				var toRow = listView.Items.Count - 1;

				if (diff > 0) {
					//START
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

						rows = IList(listView.ItemsSource); // Use the ItemsSource to get data
					} else {

						rows = listView.Items; //Get the items
					}
					// logic Jean 1-14-15
					calc(fromRow, toRow, 'MAQT');
					calc(fromRow, toRow, 'RVQT'); 
					//end logic
					oldCount = newCount = rows.Count;
					//END
				}
				//makeLb(fromRow, toRow)
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

				}
			} catch (ex : Exception) {}
		}
      private function CreateForegroundCellTemplate(bindingPath, brush) {
         var xamlTemplate = "<DataTemplate><TextBlock Text=\"{{Binding Path={0}, Mode=OneWay}}\" Foreground=\"{1}\" /></DataTemplate>";
         var xaml = String.Format(xamlTemplate, bindingPath, brush);
         return ParseTemplate(xaml);
      }
 
      private function SetColumnTemplateSelector(listView, columnIndex, selector) {
         var gridView = listView.View;
         var column = gridView.Columns[columnIndex];
         column.CellTemplateSelector = selector;
      }
 
      private function ParseTemplate(xaml) {
         var context = new ParserContext();
         context.XmlnsDictionary.Add("", "http://schemas.microsoft.com/winfx/2006/xaml/presentation");
         context.XmlnsDictionary.Add("x", "http://schemas.microsoft.com/winfx/2006/xaml");
         return XamlReader.Parse(xaml, context);
      }
   }
 
   public class CustomTemplateSelector extends DataTemplateSelector{
      public var columnIndex;
      public var templateRed;
      public var templateGreen;
	     public var templateBlack;
 
      public override function SelectTemplate(item : Object, container : DependencyObject) : DataTemplate{
       
               return templateRed;
         
 
		 
      }
   }
}