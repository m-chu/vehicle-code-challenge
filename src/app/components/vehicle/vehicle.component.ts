import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {
  userId: string = 'userId';
  vehicleForm: FormGroup;
  vehicleDisplayData;
  saveSuccess: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private vehicleSvc: VehicleService
  ) {
    this.vehicleForm = this.formBuilder.group({
      vehiclePricing: this.formBuilder.group({
        discount: ['', [
          Validators.required,
          nonNegativeNumberValidator
        ]],
        msrp: ['', [
          Validators.required,
          nonNegativeNumberValidator
        ]],
        purchasePrice: ['', [
          Validators.required,
          nonNegativeNumberValidator
        ]],
        rebate: ['', [
          Validators.required,
          nonNegativeNumberValidator
        ]]
      }),
      vehicleInfo: this.formBuilder.group({
        vehicleYear: '',
        vehicleModel: '',
        modelNumber: '',
        vin: '',
        vehicleMake: ''
      })
    });
  }

  ngOnInit() {
    this.getLocalVehicleData();
  }

  // Local Testing Data Handling
  getLocalVehicleData() {
    const vehicleData = this.vehicleSvc.getLocalVehicleData();
    console.log(vehicleData);
    this.vehicleForm.markAsPristine();
    this.vehicleForm.patchValue(vehicleData);
    this.parseVehicleData();
  }

  updateLocalVehiclePriceData() {
    let vehiclePricing = Object.assign(this.vehicleForm.value.vehiclePricing);
    this.vehicleSvc.updateLocalVehiclePriceData(vehiclePricing);
    this.saveSuccess = true;
    this.vehicleForm.markAsPristine();
    this.getLocalVehicleData();
  }

  // Remote Data Handling - Obsolete
  getVehicleData() {
    this.vehicleSvc.getVehicleData(this.userId).subscribe(data => {
      if (data) {
        this.vehicleForm.markAsPristine();
        this.vehicleForm.patchValue(data);
        this.parseVehicleData();
      }
    });
  }

  updateVehiclePriceData() {
    let vehiclePricing = Object.assign(this.vehicleForm.value.vehiclePricing, {'userId': this.userId});
    this.vehicleSvc.updateVehiclePriceData(vehiclePricing).subscribe(() => {
      this.saveSuccess = true;
      this.vehicleForm.markAsPristine();
      this.getVehicleData();
    });
  }

  // UI Display & Data Functions
  parseVehicleData() {
    this.vehicleDisplayData = Object.assign(this.vehicleForm.value.vehicleInfo, this.vehicleForm.value.vehiclePricing);
  }

  clearChanges() {
    this.saveSuccess = false;
    this.vehicleForm.markAsPristine();
    this.getLocalVehicleData(); // Local Testing Data
    // this.getVehicleData(); // Remote Data - Obsolete
  }

  resetDisplay() {
    this.saveSuccess = false;
    this.vehicleDisplayData = null;
  }

}

// Custom Form Validator Functions
export function nonNegativeNumberValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const nonNumber = new RegExp('[^0-9]');
    return nonNumber.test(control.value) ? {'nonPositiveNumber': {value: control.value}} : null;
  };
}
