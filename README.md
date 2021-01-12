## `react-modal-context`

### Usage

1. Wrap your application in `<ModalProvider>`

   ```diff
   +import { ModalProvider } from './modal-context';

   function Root(props) {
     return (
   +   <ModalProvider>
         <App />
   +   </ModalProvider>
     )
   }
   ```

2. Create a modal dialog component. This is defined as a component that calls `modal.cancel()` and/or `modal.confirm()`

   ```
   function AlertModal() {
     const modal = useModal();

     return (
       <div>
         <p>
           This is an alert message.
         </p>
         <button type="button" onClick={() => modal.confirm()}>Confirm</button>
       </div>
     )
   }
   ```

3. Open your modal from any method with `modal.open`.

   ```
   function AlertButton() {
     const modal = useModal();

     const showAlert = async () => {
       const result = await modal.open(<AlertModal />);
     }

     return (
       <button type="button" onClick={showAlert}>Show Alert</button>
     )
   }
   ```
