import { useEffect } from 'react';
import Navigation from './src/navigation/Navigation'
import { checkFilePermissions, requestPhotoPermission } from './src/utils/libraryHelper';
import { Platform } from 'react-native';


const App = () => {

  useEffect(()=>{
    //_ Requesting photo permission on IOS
    requestPhotoPermission();

    //_ Requesting read && write permission on
    checkFilePermissions(Platform.OS);
  },[]);

  return (
    <Navigation />
  )
}
export default App