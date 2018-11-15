import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {
  userId: string = 'chuMike';
  vehicleForm: FormGroup;

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
    this.getVehicleData();
  }

  getVehicleData() {
    this.vehicleSvc.getVehicleData(this.userId).subscribe(data => {
      if (data) {
        this.vehicleForm.patchValue(data);
      }
    });
  }

  updateVehiclePriceData() {
    let vehiclePricing = Object.assign(this.vehicleForm.value.vehiclePricing, {'userId': this.userId});
    this.vehicleSvc.updateVehiclePriceData(vehiclePricing).subscribe(() => {
      this.getVehicleData();
    });
  }

}

// Custom Form Validator Functions
export function nonNegativeNumberValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const nonNumber = new RegExp('[^0-9]');
    return nonNumber.test(control.value) ? {'nonPositiveNumber': {value: control.value}} : null;
  };
}
