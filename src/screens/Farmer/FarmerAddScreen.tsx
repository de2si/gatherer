import React from 'react';
// import {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import ImageInput from '@components/FormImageInput';
import {useForm} from 'react-hook-form';
import {Button} from 'react-native-paper';
import FormRadioInput from '@components/FormRadioInput';
import FormDateInput from '@components/FormDateInput';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
// import {
//   useBlockStore,
//   useDistrictStore,
//   useStateStore,
// } from '@hooks/locationHooks';
import FormTextInput from '@components/FormTextInput';
import {
  DistrictSelect,
  StateSelect,
} from '@components/FormSelectInputCollection';
// interface FarmerForm {
//   gender: string;
//   aadhaar: string;
//   category: string;
//   photo: string;
//   dob: Date;
// }

const FarmerAddScreen = () => {
  const {handleSubmit, control} = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        dob: Yup.date().required('DOB is required'),
      }),
    ),
  });
  const onSubmit = (data: any) => {
    console.log(data);
  };
  // const fetchStates = useStateStore(store => store.fetchStateData);
  // const stateData = useStateStore(store => store.stateData);
  // const fetchBlocks = useBlockStore(store => store.fetchBlockData);
  // const blockData = useBlockStore(store => store.blockData);
  // const fetchDistricts = useDistrictStore(store => store.fetchDistrictData);
  // const districtData = useDistrictStore(store => store.districtData);
  // useEffect(() => {
  //   fetchStates();
  //   fetchDistricts([23, 9]);
  //   fetchBlocks([177]);
  // }, [fetchBlocks, fetchDistricts, fetchStates]);

  // console.log('StateData:', stateData.length);
  // console.log('DistrictData:', districtData.length);
  // console.log('BlockData:', blockData.length);
  return (
    <View style={styles.container}>
      <ImageInput name="photo" control={control} />
      <FormTextInput name="name" control={control} />

      <StateSelect name="name1" control={control} variant="single" />
      <StateSelect name="name2" control={control} variant="multiple" />
      <DistrictSelect
        name="name3"
        control={control}
        variant="single"
        codes={[23]}
      />
      <DistrictSelect name="name4" control={control} variant="multiple" />
      <ImageInput
        name="add"
        control={control}
        label="Aadhar Image 1"
        variant="square"
        border="dashed"
      />
      <FormRadioInput
        name="gender"
        control={control}
        label="Gender"
        options={[
          {label: 'Male', value: 'gen'},
          {label: 'Female', value: 's'},
        ]}
      />

      <FormRadioInput
        name="category"
        control={control}
        label="Category"
        options={[
          {label: 'General', value: 'gen'},
          {label: 'SC/ST', value: 's'},
          {label: 'OBC', value: 'obc'},
          // {label: 'OBsss', value: 'ossc'},
          // {label: 'OBs2s', value: 'os2c'},
          // {label: 'OBs3s', value: 'os3c'},
          // {label: 'OBs4s', value: 'os4c'},
        ]}
      />
      <FormDateInput name="dob" control={control} label="DOB" />
      <Button onPress={handleSubmit(onSubmit)} mode="contained-tonal">
        Submit
      </Button>
    </View>
  );
};

export default FarmerAddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    rowGap: 12,
  },
});
