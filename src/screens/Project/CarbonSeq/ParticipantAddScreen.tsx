// ParticipantAddScreen.tsx

import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Portal, Snackbar, useTheme} from 'react-native-paper';
import LoadingIndicator from '@components/LoadingIndicator';

// form and form components
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import FormLandInput from '@components/FormLandInput';
import FormDocumentInput from '@components/FormDocumentInput';

// helpers
import {docValidator} from '@helpers/validators';
import {
  getErrorMessage,
  getFieldErrors,
  removeKeys,
} from '@helpers/formHelpers';

// hooks, types
import useSnackbar from '@hooks/useSnackbar';
import {useFormErrorScroll} from '@hooks/useFormErrorScroll';
import {useAuthStore} from '@hooks/useAuthStore';
import {useS3Upload} from '@hooks/useS3';
import {FormFile} from '@typedefs/common';

// api
import {api} from '@api/axios';

// nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ParticipantStackScreenProps} from '@nav/Project/CarbonSeq/ParticipantStack';
import {useParticipantStore} from '@hooks/carbonSeqHooks';

// styles
import {commonStyles, fontStyles, spacingStyles} from '@styles/common';

interface ParticipantBasicForm {
  land_parcel: {id: number; name: string};
  carbon_waiver_document: FormFile;
  agreement_document_type: FormFile;
  gram_panchayat_resolution: FormFile;
}

const landValidator = Yup.object().shape({
  id: Yup.number().required('Land is required').positive('Land must be valid'),
  name: Yup.string().required('Land must be valid'),
});

// define validation schema(s)
const participantBasicValidation: Yup.ObjectSchema<ParticipantBasicForm> =
  Yup.object().shape({
    land_parcel: landValidator.required('Land is required'),
    carbon_waiver_document: docValidator.required('Document is required'),
    agreement_document_type: docValidator
      .required('Document is required')
      .test('doc2-unique', 'Duplicate document', function (value) {
        if (!value.hash) {
          return true;
        }
        return (
          value.hash !== this.parent.carbon_waiver_document.hash &&
          value.hash !== this.parent.gram_panchayat_resolution.hash
        );
      }),
    gram_panchayat_resolution: docValidator
      .required('Document is required')
      .test('doc3-unique', 'Duplicate document', function (value) {
        if (!value.hash) {
          return true;
        }
        return (
          value.hash !== this.parent.carbon_waiver_document.hash &&
          value.hash !== this.parent.agreement_document_type.hash
        );
      }),
  });

// define default values
const participantAddDefaultValues: Partial<ParticipantBasicForm> = {};

const prepareAddFormData = (formData: ParticipantBasicForm) => {
  return {
    ...removeKeys(formData, [
      'land_parcel',
      'carbon_waiver_document',
      'agreement_document_type',
      'gram_panchayat_resolution',
    ]),
    land_parcel: formData.land_parcel.id ?? null,
    // carbon_waiver_document: formatToUrlKey(formData.carbon_waiver_document),
    // agreement_document_type: formatToUrlKey(formData.agreement_document_type),
    // gram_panchayat_resolution: formatToUrlKey(
    // formData.gram_panchayat_resolution,
    // ),
  };
};

type ParticipantAddScreenProps = NativeStackScreenProps<
  ParticipantStackScreenProps,
  'ParticipantAdd'
>;

const ParticipantAddScreen: React.FC<ParticipantAddScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const withAuth = useAuthStore(store => store.withAuth);
  const {upload: uploadToS3} = useS3Upload();

  const [loading, setLoading] = useState(false);
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('Error');
  const setRefresh = useParticipantStore(store => store.setRefresh);

  const defaultValues = participantAddDefaultValues;

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: {errors},
  } = useForm<ParticipantBasicForm>({
    defaultValues,
    resolver: yupResolver(participantBasicValidation),
  });

  const {
    scrollViewRef,
    fieldOrder,
    handleLayout,
    manualScroll,
    setManualScroll,
    scrollToFirstError,
  } = useFormErrorScroll();

  useEffect(() => {
    scrollToFirstError(errors);
  }, [errors, scrollToFirstError]);

  useEffect(() => {
    if (manualScroll) {
      scrollToFirstError(errors);
      setManualScroll(false);
    }
  }, [errors, manualScroll, scrollToFirstError, setManualScroll]);

  const onSubmit = async (formData: ParticipantBasicForm) => {
    try {
      setLoading(true);
      const {
        carbon_waiver_document,
        agreement_document_type,
        gram_panchayat_resolution,
      } = formData;
      const uploadedDocs = await uploadToS3({
        carbon_waiver_document,
        agreement_document_type,
        gram_panchayat_resolution,
      });
      const participantAddData = {
        ...prepareAddFormData(formData),
        ...uploadedDocs,
      };
      await withAuth(async () => {
        try {
          const result = await api.post('projects/1/', participantAddData);
          if (result.status === 201) {
            reset(participantAddDefaultValues);
            showSnackbar('Participant added successfully');
            setRefresh();
            setTimeout(() => {
              navigation.replace('ParticipantDetail', {
                id: result.data.id,
                participant: result.data,
              });
            }, 2000);
          }
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      if (typeof errorMessage === 'string') {
        showSnackbar(errorMessage);
      } else {
        getFieldErrors(errorMessage).forEach(
          ({fieldName, fieldErrorMessage}) => {
            type FormFieldName = keyof ParticipantBasicForm;
            if (fieldName === 'land_parcel_id') {
              setError('land_parcel' as FormFieldName, {
                message: fieldErrorMessage,
              });
            } else if (
              (fieldName === 'carbon_waiver_document' ||
                fieldName === 'agreement_document_type' ||
                fieldName === 'gram_panchayat_resolution') &&
              fieldErrorMessage.includes('already exists')
            ) {
              setError(fieldName, {message: 'Document already exists'});
            } else if (fieldOrder.current.includes(fieldName)) {
              setError(fieldName as FormFieldName, {
                message: fieldErrorMessage,
              });
            }
          },
        );
        setManualScroll(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView ref={scrollViewRef}>
      <View style={commonStyles.flex1}>
        <View
          style={[
            spacingStyles.mh16,
            spacingStyles.pv16,
            spacingStyles.rowGap8,
          ]}>
          <FormLandInput
            name="land_parcel"
            control={control}
            onLayout={handleLayout}
          />
          <FormDocumentInput
            name="carbon_waiver_document"
            label="Carbon waiver"
            control={control}
            onLayout={handleLayout}
          />
          <FormDocumentInput
            name="agreement_document_type"
            label="Agreement"
            control={control}
            onLayout={handleLayout}
          />
          <FormDocumentInput
            name="gram_panchayat_resolution"
            label="Gram panchayat resolution"
            control={control}
            onLayout={handleLayout}
          />
          <View
            style={[
              commonStyles.centeredContainer,
              spacingStyles.mt16,
              spacingStyles.mb48,
            ]}>
            <Button
              onPress={handleSubmit(onSubmit)}
              mode="contained"
              buttonColor={theme.colors.secondary}
              disabled={loading}
              labelStyle={fontStyles.bodyXl}>
              Submit
            </Button>
          </View>
        </View>
        <Portal>{loading && <LoadingIndicator />}</Portal>
        <Portal>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={dismissSnackbar}
            duration={Snackbar.DURATION_SHORT}>
            {snackbarMessage}
          </Snackbar>
        </Portal>
      </View>
    </ScrollView>
  );
};

export default ParticipantAddScreen;
