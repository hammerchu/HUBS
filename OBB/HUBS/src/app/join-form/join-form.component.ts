import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "join-form",
  templateUrl: "./join-form.component.html",
  styleUrls: ["./join-form.component.scss"],
})
export class JoinFormComponent {
  /**
   * THe UI form compontent that receive room URL and username from user
   * it might get bypass by hardcoding these values in the parent component
   * if there is no need to get updated from time to time.
   */

  // declare event which is listened by the parent container
  @Output() setUserName_: EventEmitter<string> = new EventEmitter();
  @Output() setUrl_: EventEmitter<string> = new EventEmitter();

  joinForm = this.formBuilder.group({
    name: "",
    url: "",
  });

  constructor(private formBuilder: FormBuilder) {}

  onSubmit(): void {
    const { name, url } = this.joinForm.value;
    if (!name || !url) return;

    // Clear form inputs
    this.joinForm.reset();
    // Emit event to update userName var in parent component
    this.setUserName_.emit(name);
    // Emit event to update URL var in parent component
    this.setUrl_.emit(url);
  }
}
