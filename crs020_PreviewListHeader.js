import System;
import System.Windows;
import System.Windows.Controls;
import System.Windows.Data;
import System.Collections;
import Mango.UI.Core;
import MForms;

package MForms.JScript
{
   class crs020_PreviewListHeader
   {
      public function Init(element: Object, args: Object, controller : Object, debug : Object) {
         var content : Object = controller.RenderEngine.Content;
         var label1 : Object = FindElementByPosition(content, 11, 1);
         var label2 : Object = FindElementByPosition(content, 16, 1);
         var colNames : String = "";
         if(label1 != null) {
            colNames = label1.Content;
         }
         if(label2 != null) {
            colNames = colNames + label1.Content;
         }


         var WWSFLL : Object = FindElement(content, "WWSFLL");
         var WWSFLR : Object = FindElement(content, "WWSFLR");

         var str : String = "";
         if(WWSFLL != null) {
            str = WWSFLL.Text;
         }
         if(WWSFLR != null) {
            str = str + WWSFLR.Text;
         }

	      var colValues : Object = str.split(' ');

         var startpos = 0;
         var listView : ListView = new ListView();
         var gridView : GridView = new GridView();
         var listRow : int = Grid.GetRow(WWSFLL) + 1;

         var listItems : ArrayList = new ArrayList();
         var listItem : ArrayList = new ArrayList();

         listView.Style = StyleManager.StyleListView;
         gridView.ColumnHeaderContainerStyle = StyleManager.StyleGridViewColumnHeader;

         for(var i=0; i<colValues.length; i++)
	      {
	         var header = colNames.substring(startpos, startpos+colValues[i].length).Trim();
	         var cell = colValues[i];

	         startpos = startpos+colValues[i].length+1;

	         var gc : GridViewColumn = new GridViewColumn();
	         var gh : GridViewColumnHeader = new GridViewColumnHeader();

	         gc.DisplayMemberBinding = new Binding("[" + i + "]");
	         gh.Content = header;

            var oneChar = cell.substring(0,1);
      		var twoChar = cell.substring(0,2);
      		var threeChar = cell.substring(0,3);
      		if(oneChar == '0' || oneChar == '9' || twoChar == '-9' || threeChar == 'CR9') {
      			gh.HorizontalContentAlignment = HorizontalAlignment.Right;
      		} else {
      		   gh.HorizontalContentAlignment = HorizontalAlignment.Left;
      		}

            gc.Header = gh;
	         gridView.Columns.Add(gc);
	         listItem.Add(cell);
	      }

         listItems.Add(listItem);
	      listView.View = gridView;
	      listView.ItemsSource = listItems;
	      listView.Width = 72 * Configuration.CellWidth;
	      listView.Height = 5 * Configuration.CellHeight;

	      Grid.SetColumn(listView, 1);
	      Grid.SetRow(listView, listRow);
         Grid.SetColumnSpan(listView, 72);
         Grid.SetRowSpan(listView, 5);

         content.Children.Add(listView);
      }

      public function FindElementByPosition(content: Object, top: int, left: int) : Object {
         var i, t, l : int;
         for(i=0; i<content.Children.Count; i++) {
            var o: Object = content.Children[i];
            t = Grid.GetRow(o) + 1;
            l = Grid.GetColumn(o) + 1;
            if(t == top && l == left) {
               return (o);
            }
         }
         return (null);
      }

      public function FindElement(content: Object, elementName: String) : Object {
         var i : int = 0;
         for(i=0; i<content.Children.Count; i++) {
            if(content.Children[i].Name.Equals(elementName)) {
               return (content.Children[i]);
            }
         }
         return (null);
      }
   }
}