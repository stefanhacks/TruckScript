export interface Bootable {
  setup(): void;
  boot?(): void;
}
