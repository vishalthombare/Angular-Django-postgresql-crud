import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {DashboardService} from '../../shared/service/dashboard.service';

declare const $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('CustomerMasterPaginator',{read: MatPaginator}) CustomerMasterPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  CustomerData :MatTableDataSource<CustomerMasterElement>;

  displayColumns = [
    'actions',
    'id',
    'customer_name',
    'customer_address',
    'customer_phone'
  ];
  renderedData: CustomerMasterElement[];
  CustomerForm: FormGroup;
  submitButton:string = ''

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private custService:DashboardService) { }

  ngOnInit(): void {

    $( document ).ready(function() {
      $('#new_entry_form').hide();
      $('#new_entry_title').hide();
      $('#btn_list').hide();
    });

    this.submitButton = 'Submit';

    this.CustomerForm = this.formBuilder.group({
      id:[''],
      customer_name: ['',[Validators.required,
                        Validators.maxLength(20),
                        Validators.pattern("^[a-zA-Z0-9_ ]*$")]],
      customer_address: ['',[Validators.required,
                        Validators.maxLength(20),
                        Validators.pattern("^[a-zA-Z0-9_ ]*$")]],
      customer_phone: ['',[Validators.required,
                        Validators.maxLength(10), 
                        Validators.pattern('[1-9]{1}[0-9]{9}')]]
    })

    this.custService.getCustomerData().subscribe((data:any) => {
      this.CustomerData = new MatTableDataSource(data);
      this.CustomerData.paginator = this.CustomerMasterPaginator
      this.CustomerData.sort = this.sort;
      this.CustomerData.connect().subscribe(d => this.renderedData=d);
    })

  }

  showNewEntry(){
    $("#list_form").hide();
    $("#list_title").hide();
    $("#btn_new_entry").hide();
    $("#btn_list").show();
    $("#new_entry_form").show();
    $("#new_entry_title").show();
  }
  showList(){  
    $('#tableExport').show();
    $("#list_form").show();
    $("#list_title").show();
    $("#btn_new_entry").show();
    $("#btn_list").hide();
    $("#new_entry_form").hide();
    $("#new_entry_title").hide();
  }

  tbl_FilterDatatable(value:string) {
    this.CustomerData.filter = value.trim().toLocaleLowerCase();
  }

  onSubmit(){
    this.custService.saveCustomerData(this.CustomerForm.value).subscribe(data => { 
      if (data['status'] == 2) {
        Swal.fire({
          title: 'Your record has been updated successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }else{
        Swal.fire({
          title: 'Your record has been Added successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } 
      this.router.navigate(['/dashboard/main']).then(() => {
        setTimeout(function() {window.location.reload();} , 2000);
      });            
    },
    error=>{
      Swal.fire({
        title: 'Internal Server Error',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
      });
    });
  }

  viewAllMasterData(row){
    this.CustomerForm.patchValue({
      id: row.id,
      customer_address: row.customer_address,
      customer_name: row.customer_name,
      customer_phone: row.customer_phone
    })
    $("#list_form").hide();
    $("#list_title").hide();
    $("#btn_new_entry").hide();
    $("#btn_list").show();
    $("#new_entry_form").show();
    $("#new_entry_title").show();
    $("#submit_btn").hide();
  }

  editCompanyData(row){
    this.submitButton = 'Update';
    this.CustomerForm.patchValue({
      id: row.id,
      customer_address: row.customer_address,
      customer_name: row.customer_name,
      customer_phone: row.customer_phone
    })
    $("#list_form").hide();
    $("#list_title").hide();
    $("#btn_new_entry").hide();
    $("#btn_list").show();
    $("#new_entry_form").show();
    $("#new_entry_title").show();    
  }

  deleteCompanyData(id){
    this.custService.deleteCustomerData(id).subscribe(data => {
      Swal.fire({
        title: 'Your record has been Deleted successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      this.router.navigate(['/dashboard/main']).then(() => {
        setTimeout(function() {window.location.reload();} , 2000);
      });
    },
    error=>{
      Swal.fire({
        title: 'Internal Server Error',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
      });
    });
  }

}


export interface CustomerMasterElement {
  id:any;
  customer_name:string;  
  customer_address:string; 
  customer_phone:number;
}