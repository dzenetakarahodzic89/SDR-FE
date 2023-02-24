import { Component, OnInit } from '@angular/core';
import { ObjectType } from '../../shared/object-type.constant';
import { ZxBlockModel } from '@zff/zx-block';
import {  GridOptions } from '@ag-grid-enterprise/all-modules';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxConfirmation } from '@zff/zx-core';
import { CountryResponse, CountryUpdateRequest } from '../shared/country.model';
import { CountryService } from '../shared/country.service'; 
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-country-overview',
  templateUrl: './country-overview.component.html',
  styleUrls: ['./country-overview.component.scss']
})
export class CountryOverviewComponent implements OnInit {

  type = ObjectType.COUNTRY;
  countryIsLoading = false;

  public countriesBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true
  });

  countryColumnDefs = [
    {
      field: 'name',
      headerName: 'Country',
      flex: 3,
      floatingFilter: false
    },
    {
      field: 'region',
      headerName: 'Region',
      flex: 2,
      floatingFilter: false
    },
    {
      field: 'flagAbbriviation',
      headerName: 'Flag Abbriviation',
      flex: 1,
      floatingFilter: false
    },
    {
      field: 'flagAbbriviation',
      headerName: 'Flag Preview',
      flex: 1,
      floatingFilter: false,
      cellRenderer: function(params) {
        return '<span class="fi fi-' + params.value.toLowerCase() + '"></span>'
      }
    }
  ];

  public countryGridOptions: GridOptions = {
    columnDefs: this.countryColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.country = event["data"];
      this.model.id = event["data"].id;
      this.model.name = event["data"].name;
      this.model.region = event["data"].region;
      this.model.flagAbbriviation = event["data"].flagAbbriviation;
    }
  } as GridOptions;

  public formConfig = new Definition({ name: 'updateCountry', template: 'ZxForm', disabled: false, children: [] });

  public mainButtons = new ZxButtonModel({items: [
      { name: 'checkFlag', layout: 'classic', class: 'invert', label: 'Check flag', action: () => this.checkFlag() },
      { name: 'save', layout: 'classic', label: 'Save', class: 'invert', action: () => this.updateCountry() },
      { name: 'cancel', layout: 'classic', class: 'danger invert', label: 'Cancel', action: () => this.cancel() }
    ]
  });
  
  countries: CountryResponse[];
  country: CountryResponse;
  model: CountryUpdateRequest;
  flag: string;

  constructor( private countryService: CountryService, public confirmation: ZxConfirmation,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
    this.setFormChildren();
    this.model = new CountryUpdateRequest();
    this.model.name = "test";
  }

  loadData()
  {
    this.countryIsLoading = true;
    
      this.countryService.getCountries().subscribe((response : CountryResponse[]) =>
      {
        this.countries = response;
        this.countryGridOptions.api?.setRowData(this.countries);
        this.countryIsLoading = false;
      })
    
  }

  public setFormChildren() {
    this.formConfig.addChildren = [
      new Definition({ template: 'ZxInput', class: ['col-12'], type: 'text', name: 'name', label: 'Name', validation: { required: true } }),
      new Definition({ template: 'ZxInput', class: ['col-12'], type: 'text', name: 'region', label: 'Region' }),
      new Definition({ template: 'ZxInput', class: ['col-12'], type: 'text', name: 'flagAbbriviation', label: 'Flag Abbriviation', validation: {required: true} }),
      
    ]
  }

  updateCountry() {
    if (!this.formConfig.isValid){
      this.toastr.error("Fill in required fields!");
      return;
    }

    this.countryService.updateCountry(this.model).subscribe(
      (responseCode) => {
        if (responseCode.hasOwnProperty('payload')) {
          this.countries = this.countries.filter(c => c.id!=this.model.id);
          let updatedCountry :CountryResponse = {id:this.model.id,name:this.model.name,region:this.model.region,flagAbbriviation:this.model.flagAbbriviation};
          this.countries.push(updatedCountry);
          this.toastr.success("Country edit successful!");
          this.country = null;
          this.model = new CountryUpdateRequest();
        } else {
          this.toastr.error('Country edit failed!');
        }
      },
      (errorMsg: string) => {
        this.toastr.error('Country edit failed!');
      }
    );

  }

  cancel() {
    this.model.name = this.country.name;
    this.model.region = this.country.region;
    this.model.flagAbbriviation = this.country.flagAbbriviation;
  }

  checkFlag() {
    this.flag = "fi fi-" + this.model.flagAbbriviation.toLowerCase();
  }

}
