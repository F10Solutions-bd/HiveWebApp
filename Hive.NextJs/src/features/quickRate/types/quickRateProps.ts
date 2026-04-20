/**
 * Props for the Quick Rate modal component.
 *
 * Controls modal visibility and basic metadata.
 *
 * #property 
 * isOpen - Determines whether the modal is visible
 * onClose - Callback function triggered when the modal is closed
 * 
 * @property isOpen - Determines whether the modal is visible
 * @property onClose - Callback function triggered when the modal is closed
 */

export interface QuickRateProps {
  isOpen: boolean;
  onClose: () => void;
}