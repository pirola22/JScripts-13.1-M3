import System;
import System.Windows;
import System.Windows.Controls;
import System.Windows.Threading;
import System.Windows.Input;
import System.Windows.Media;

import MForms;
import Mango.UI;
import Mango.UI.Core;
import Mango.UI.Core.Util;
import Mango.Services;
import Lawson.M3.MI;
import Mango.UI.Services;
import Mango.UI.Services.Lists;
import System.Globalization;

import System.Xml;
import System.Windows.Data;
import System.Windows.Markup;

import System.Collections;

package MForms.JScript {

    class OIS100I_EntryMsg {

    var controller, host;
    var debug;
    var cuno, orno, pyno;
    var buttonentryMsg, buttonClose;

    var grid, listView, gridView;
    var recordCount = 0;
    var result = false;

    public function Init(element: Object, args: Object, controller: Object, debug: Object) {

        this.controller = controller;

        var content: Object = controller.RenderEngine.Content;
        this.debug = debug;

        this.cuno = ScriptUtil.FindChild(content, "OACUNO");
        this.orno = ScriptUtil.FindChild(content, "OAORNO");

        // Create the button
        this.buttonentryMsg = new Button();
        buttonentryMsg.Content = 'Entry Notes';
        buttonentryMsg.ToolTip = 'Shows CO Entry Messages';

        //Set button properties
        //Horizontal
        buttonentryMsg.HorizontalAlignment = HorizontalAlignment.Left;
        Grid.SetColumn(buttonentryMsg, 70);
        Grid.SetColumnSpan(buttonentryMsg, 98);

        // Vertical
        buttonentryMsg.VerticalAlignment = VerticalAlignment.Top;
        Grid.SetRow(buttonentryMsg, 3);
        Grid.SetRowSpan(buttonentryMsg, 23);

        buttonentryMsg.Width = 10 * Configuration.CellWidth;
        buttonentryMsg.Height = 1 * Configuration.CellHeight;

        this.grid = new Grid();


        this.listView = new ListView();
        this.listView.Style = StyleManager.StyleListView;
        this.listView.ItemContainerStyle = StyleManager.StyleListViewItem;
        

        this.gridView = new GridView();
        this.gridView.ColumnHeaderContainerStyle = XamlReader.Parse("<Style TargetType=\"GridViewColumnHeader\" BasedOn=\"{StaticResource styleGridViewColumnHeader}\" xmlns='http://schemas.microsoft.com/winfx/2006/xaml/presentation'><Setter Property=\"MinHeight\" Value=\"0\" /></Style>");


        var gvc = new GridViewColumn();
        gvc.Header = "S.no";
        gvc.Width = 50;
        gvc.DisplayMemberBinding = new Binding("[0]");
        this.gridView.Columns.Add(gvc);
        

		var gvc1 = new GridViewColumn();
        gvc1.Header = "Customer/Payer";
        gvc1.Width = 100;
        gvc1.DisplayMemberBinding = new Binding("[1]");
        this.gridView.Columns.Add(gvc1);
        
		var gvc2 = new GridViewColumn();
        gvc2.Header = "EntryNote";
        gvc2.Width = 650;
        gvc2.DisplayMemberBinding = new Binding("[2]");
        this.gridView.Columns.Add(gvc2);
        
		listView.View = gridView;

        // get Entry message using customer number
        callMDBReadMICustomer(this.cuno.Text);

        controller.RenderEngine.Content.Children.Add(buttonentryMsg);

        buttonentryMsg.add_Click(OnClickOpenModal);
        controller.add_Requested(OnRequested);
    }


    public function OnClickOpenModal(sender: Object, e: RoutedEventArgs) {
        try {
            var content = CreateWindowContent();
            content.Width = 800;
            content.Height = 600;

            var title = "CO Entry Message";
            host = new HostWindow(true);
            host.HostContent = content;
            host.HostTitle = title;

            DashboardService.Current.ShowDialog(host); // Use DashboardService to get modal "shake".
        } catch (ex) {
            debug.WriteLine(ex);
        }
    }


    public function CreateWindowContent() {

        return this.grid;
    }

    public function callMDBReadMICustomer(PK01: String) {
        try {
            var record = new MIRecord();

            record["FILE"] = "OCUSMA00";
            record["PK01"] = PK01;
            record["PK02"] = "ENTRYNOTE";

            MIWorker.Run("MDBREADMI", "LstCUGEX100", record, responseForMDBReadMICustomer);
        } catch (ex: Exception) {
            result = false;
            debug.WriteLine("Exception MDBREADMI : LstCUGEX100", + ex);
        }
    }

    //duplicating function for calling same MI
    public function callMDBReadMIPayer(PK01: String) {
        try {
            var record = new MIRecord();

            record["FILE"] = "OCUSMA00";
            record["PK01"] = PK01;
            record["PK02"] = "ENTRYNOTE";

            MIWorker.Run("MDBREADMI", "LstCUGEX100", record, responseForMDBReadMIPayer);
        } catch (ex: Exception) {
            result = false;
            debug.WriteLine("Exception MDBREADMI : LstCUGEX100", + ex);
        }
    }

    public function callOIS100MI(ORNO: String) {
        try {
            var record = new MIRecord();
            record["ORNO"] = ORNO;
            MIWorker.Run("OIS100MI", "GetHead", record, responseForOIS100MI);
        } catch (ex: Exception) {
            debug.WriteLine("Exception OIS100MI : GetHead", + ex);
        }
    }


    public function responseForOIS100MI(response: MIResponse) {
        if (response.HasError) {
            return;
        }
        this.pyno = response.Item["PYNO"];
        callMDBReadMIPayer(this.pyno);
    }

    public function responseForMDBReadMICustomer(response: MIResponse) {
        if (response.HasError) {
            this.result = false;
            return;
        }

        this.result = true;

        var count = response.Items.Count
        var record;
        recordCount = count;


        var list = new ArrayList();
       

        for (var i = 0; i < count; i++) {

            record = response.Items[i];

            var PK01 = record["PK01"];
            var entryNote = record["A121"];
            var PK04 = record["PK04"];
            var PK05 = record["PK05"];

            debug.WriteLine(PK01);
            debug.WriteLine(entryNote);

            var obj = new Object();
            obj[0] = PK04;
            obj[1] = PK01;
            obj[2] = entryNote;
            obj[3] = PK05;
        
            list.Add(obj);
        }
            
    	// sort the list using sequence number PK04
    	
        for(var i=1; i<list.Count; i++) {
        	var obj = list[i];
        	var key = int.Parse(obj[0]);
        	
        	var j= i-1;
        	
        	while(j >=0 && int.Parse(list[j][0]) > key) {
        		list[j+1] = list[j];
        		j = j-1;
        	}
        	
        	list[j+1] = obj;
        }
        		
		var curDate = int.Parse(getCurrentDate());
		
        for ( var j = 0; j < list.Count; j++ )  {
        	//Check if entry is expired using PK05
        	if( int.Parse(list[j][3]) >= curDate )	
            	listView.Items.Add(list[j]);
        }

        if(recordCount > 0) {
            this.buttonentryMsg.Background = Brushes.DimGray;
            this.grid.Children.Add(this.listView);
        } else {
            //get entry notes for payer
            callOIS100MI(this.orno.Text);            
        }
    }
    

    public function responseForMDBReadMIPayer(response: MIResponse) {
        if (response.HasError) {
            this.result = false;
            return;
        }

        this.result = true;

        var count = response.Items.Count
        var record;
        recordCount = count;


        var list = new ArrayList();
       

        for (var i = 0; i < count; i++) {

            record = response.Items[i];

            var PK01 = record["PK01"];
            var entryNote = record["A121"];
            var PK04 = record["PK04"];
            var PK05 = record["PK05"];

            debug.WriteLine(PK01);
            debug.WriteLine(entryNote);

            var obj = new Object();
            obj[0] = PK04;
            obj[1] = PK01;
            obj[2] = entryNote;
            obj[3] = PK05;
        
            list.Add(obj);
        }
            
    	// sort the list using sequence number PK04
    	
        for(var i=1; i<list.Count; i++) {
        	var obj = list[i];
        	var key = int.Parse(obj[0]);
        	
        	var j= i-1;
        	
        	while(j >=0 && int.Parse(list[j][0]) > key) {
        		list[j+1] = list[j];
        		j = j-1;
        	}
        	
        	list[j+1] = obj;
        }
        		
		var curDate = int.Parse(getCurrentDate());
		
        for ( var j = 0; j < list.Count; j++ )  {
        	//Check if entry is expired using PK05
        	if( int.Parse(list[j][3]) >= curDate )	
            	listView.Items.Add(list[j]);
        }

        if(recordCount > 0) {
            this.buttonentryMsg.Background = Brushes.DimGray;
            this.grid.Children.Add(this.listView);
        }
    }


    public function getCurrentDate() {
    	var date =  new Date();
    	
    	var year = date.getYear();
    	var month = date.getMonth()+1;
    	var date = date.getDate();
    	
    	if(month <= 9)
    		month = "0" + month;
    		
    	if(date <= 9)
    		date = "0" + date;
    		
    	var curDate = year +""+ month +""+ date;
    	
    	return curDate
    	
    }

    public function OnClickClose(sender: Object, e: RoutedEventArgs) {
        if (host != null) {
            host.Close();
            host = null;
        }
    }

    public function OnRequested(sender: Object, e: RequestEventArgs) {
        buttonentryMsg.remove_Click(OnClickOpenModal);
        controller.remove_Requested(OnRequested);
        if (buttonClose != null) {
            buttonClose.remove_Click(OnClickClose);
        }
    }
}
}