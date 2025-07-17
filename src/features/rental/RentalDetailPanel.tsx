import React, { useState, useCallback, useMemo, useEffect } from 'react';

// --- UI 컴포넌트 임포트 ---
import { SlidePanel } from '@/components/ui/modal/slide-panel/SlidePanel';
import { BasicButton } from '@/components/ui/button/BasicButton';
import { Badge } from '@/components/ui/badge/Badge';
import { Text } from '@/components/ui/text/Text';
import { TextArea } from '@/components/ui/input/textarea/TextArea';

// --- 스타일드 컴포넌트 임포트 ---
import {
  PanelWrapper,
  PanelSection,
  PanelRowContainer,
  PanelRowSection,
  PanelLabelContainer,
  PanelValueContainer,
  PanelFieldWrapper,
  PanelColumnSection,
} from '@/components/ui/modal/slide-panel/SlidePanel.styles';

// --- 타입 및 훅 임포트 ---
import { useDetailPanel } from './hooks/useRentalDetail';
import { DateTimeInput } from '@/components/ui/input/date-time/DateTimeInput';
import { FormFieldWrapper, FormSection, FormTitleWrapper } from './RentalRegisterPopup.styles';
import { MiniButton } from '@/components/ui/button/MiniButton';

// --- 아이콘 ---
import EditIcon from '@/assets/icons/ic-edit.svg?react';
import { CustomerSelectedItem } from './components/CustomerSelectedItem';
import { SearchText } from './components/SearchText';
import { CustomerSearchItem } from './components/CustomerSearchItem';
import {
  RENTAL_STATUS_CANCELED,
  RENTAL_STATUS_RENTED,
  RENTAL_STATUS_RETURNED,
  type SearchCustomerSummary,
  type SearchVehicleSummary,
} from './types';

import { fetchSearchCustomer, fetchSearchVehicle } from './api/rental-api';
import { VehicleSelectedItem } from './components/VehicleSelectedItem';
import { formatDateTime } from '@/utils/date';
import { VehicleSearchItem } from './components/VehicleSearchItem';
import { toast } from 'react-toastify';

// --- RentalDetailPanel 컴포넌트 props ---
interface RentalDetailPanelProps {
  rentalId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessSave?: () => void;
}

/**
 * 예약 상세 정보를 표시하고, 편집 및 삭제 기능을 제공하는 슬라이드 패널 컴포넌트입니다.
 */
export const RentalDetailPanel: React.FC<RentalDetailPanelProps> = ({ rentalId, isOpen, onClose, onSuccessSave }) => {
  // -----------------------------------------------------------------------
  // 🚀 상세 패널 훅으로부터 상태 및 함수 가져오기
  // -----------------------------------------------------------------------
  const {
    selectedItem,
    formData,
    errors,
    openPanel,
    closePanel,
    isLoadingDetail,
    handleInputChange,
    initForm,
    resetForm,
    handleUpdateRental,
    handleUpdateRentalStatus,
    isAvailableVehicleSearch,
    isStatusPending,
    isStatusRented,
  } = useDetailPanel();

  // --- UI 모드 및 편집 데이터 상태 관리 ---
  const [isEditMode, setIsEditMode] = useState(false);
  const isSelectedCustomer = formData.customer;
  const isSelectedVehicle = formData.vehicle;

  // --- useEffect: 패널 열림/닫힘 및 데이터 로딩 제어 ---
  useEffect(() => {
    if (isOpen && rentalId !== null) {
      openPanel(rentalId);
      setIsEditMode(false);
    } else if (!isOpen) {
      closePanel();
      resetForm();
      setIsEditMode(false);
    }
  }, [isOpen, rentalId, openPanel, closePanel, resetForm]);

  // --- useEffect: 불러온 상세 정보로 편집 데이터 초기화 ---
  useEffect(() => {
    if (selectedItem) {
      initForm(selectedItem);
    }
  }, [selectedItem, initForm]);

  // -----------------------------------------------------------------------
  // 핸들러 함수들
  // -----------------------------------------------------------------------

  /**
   * '편집' 버튼 클릭 시 편집 모드로 전환합니다.
   */
  const handleEdit = useCallback(() => {
    setIsEditMode(true);
  }, []);

  /**
   * '수정' 버튼 클릭 시 차량 정보 수정을 처리합니다.
   * API를 호출하고, 성공 시 편집 모드를 종료하고 패널을 닫습니다.
   */
  const handleSave = useCallback(async () => {
    const result = await handleUpdateRental();
    if (result) {
      setIsEditMode(false);
      onSuccessSave?.();
      onClose();
    }
  }, [handleUpdateRental, onClose, onSuccessSave]);

  /**
   * 편집 모드에서 '취소' 버튼 클릭 시 편집 내용을 되돌리고 편집 모드를 종료합니다.
   */
  const handleCancel = useCallback(() => {
    if (selectedItem) {
      initForm(selectedItem);
    }
    setIsEditMode(false);
  }, [selectedItem, initForm]);

  const handleUpdateStatus = useCallback(
    async (status: string) => {
      const result = await handleUpdateRentalStatus(status);
      if (result) {
        onSuccessSave?.();
      }
    },
    [handleUpdateRentalStatus, onSuccessSave]
  );

  /**
   * 애뮬레이터 시동을 위한 페이지로 이동합니다.
   */
  const handleNavigateToEmulator = useCallback(() => {
    const baseUrl = import.meta.env.VITE_EMULATOR_SERVICE_URL;
    if (baseUrl && selectedItem?.vehicle?.id) {
      const targetUrl = `${baseUrl}/emulator/${selectedItem?.vehicle?.id}`;
      window.open(targetUrl, '_blank');
    } else {
      toast.error('시동을 할 수 없습니다.');
    }
  }, [selectedItem]);

  /**
   * 슬라이드 패널이 닫힐 때 호출되며, 편집 모드를 초기화하고 패널을 닫습니다.
   */
  const handlePanelClose = useCallback(() => {
    setIsEditMode(false);
    onClose();
  }, [onClose]);

  const handleClickCustomer = (item: SearchCustomerSummary) => {
    handleInputChange('customer', item);
  };

  const handleClickVehicle = (item: SearchVehicleSummary) => {
    handleInputChange('vehicle', item);
  };

  const handleCancelCustomer = () => {
    handleInputChange('customer', null);
  };

  const handleCancelVehicle = () => {
    handleInputChange('vehicle', null);
  };

  /**
   * 차량 상태에 따른 배지 색상을 반환합니다.
   */
  const getBadgeColor = useCallback((status: string): string => {
    switch (status) {
      case 'RENTED':
        return 'orange';
      case 'RETURNED':
        return 'green';
      case 'CANCELED':
        return 'red';
      default:
        return 'gray';
    }
  }, []);

  // --- 패널 하단 액션 버튼 렌더링 (메모이제이션) ---
  const panelActions = useMemo(() => {
    if (isLoadingDetail || !selectedItem) {
      return null;
    }

    return (
      <>
        {isEditMode ? (
          <>
            <BasicButton onClick={handleCancel} buttonType="basic">
              취소
            </BasicButton>
            <BasicButton onClick={handleSave} buttonType="primary">
              수정
            </BasicButton>
          </>
        ) : (
          <>
            {isStatusPending() && (
              <>
                <BasicButton
                  onClick={() => {
                    handleUpdateStatus(RENTAL_STATUS_CANCELED);
                  }}
                  buttonType="red"
                >
                  예약 취소
                </BasicButton>
                <BasicButton
                  onClick={() => {
                    handleUpdateStatus(RENTAL_STATUS_RENTED);
                  }}
                  buttonType="primary"
                >
                  예약
                </BasicButton>
              </>
            )}

            {isStatusRented() && (
              <>
                <BasicButton onClick={handleNavigateToEmulator} buttonType="basic">
                  시동 체험
                </BasicButton>
                <BasicButton
                  onClick={() => {
                    handleUpdateStatus(RENTAL_STATUS_RETURNED);
                  }}
                  buttonType="primary"
                >
                  예약 반납
                </BasicButton>
              </>
            )}

            <BasicButton onClick={handleEdit} buttonType="primary">
              편집
            </BasicButton>
          </>
        )}
      </>
    );
  }, [
    isEditMode,
    selectedItem,
    isStatusPending,
    isStatusRented,
    isLoadingDetail,
    handleEdit,
    handleSave,
    handleCancel,
    handleUpdateStatus,
    handleNavigateToEmulator,
  ]);

  /**
   * 패널의 실제 내용을 렌더링하는 함수입니다.
   * 로딩, 또는 데이터 유무에 따라 다른 메시지를 표시하거나, 상세 정보를 렌더링합니다.
   */
  const renderPanelContent = () => {
    if (isLoadingDetail) {
      return (
        <PanelWrapper style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Text type="body1">상세 정보를 불러오는 중입니다...</Text>
        </PanelWrapper>
      );
    }

    if (!selectedItem) {
      return (
        <PanelWrapper style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Text type="body1">예약 정보를 찾을 수 없습니다.</Text>
        </PanelWrapper>
      );
    }

    return (
      <PanelWrapper>
        {/* --- 예약 정보 섹션 --- */}
        <PanelSection>
          <Text type="subheading2">예약 정보</Text>

          <PanelColumnSection>
            <Text type="label">상태</Text>
            <Badge $badgeColor={getBadgeColor(selectedItem.rentalStatus)}>{selectedItem.rentalStatusName}</Badge>
          </PanelColumnSection>

          <PanelRowSection>
            <PanelFieldWrapper>
              <DateTimeInput
                label="픽업 시간"
                selectedDate={formData.pickupAt}
                onDateChange={value => handleInputChange('pickupAt', value)}
                placeholder="예약 날짜를 선택하세요"
                errorText={errors.pickupAt}
                required
                disabled={!(isEditMode && isStatusPending())}
              />
            </PanelFieldWrapper>
            <PanelFieldWrapper>
              <DateTimeInput
                label="반납 시간"
                selectedDate={formData.returnAt}
                onDateChange={value => handleInputChange('returnAt', value)}
                placeholder="예약 날짜를 선택하세요"
                required
                errorText={errors.returnAt}
                disabled={!(isEditMode && isStatusPending())}
              />
            </PanelFieldWrapper>
          </PanelRowSection>
        </PanelSection>

        {/* --- 고객 정보 섹션 --- */}
        {isEditMode && isStatusPending() ? (
          <FormSection>
            <FormTitleWrapper>
              <Text type="subheading2">고객 정보</Text>
              {isSelectedCustomer && (
                <MiniButton icon={<EditIcon />} $buttonType="light-gray" onClick={handleCancelCustomer}>
                  변경
                </MiniButton>
              )}
            </FormTitleWrapper>
            <FormFieldWrapper>
              {isSelectedCustomer ? (
                <CustomerSelectedItem item={formData.customer!} />
              ) : (
                <SearchText
                  id="customer-search"
                  placeholder="고객명 또는 전화번호로 검색"
                  fetch={fetchSearchCustomer}
                  renderResults={results =>
                    results &&
                    results.map((item: any) => (
                      <CustomerSearchItem key={item.id} item={item} onClick={handleClickCustomer} />
                    ))
                  }
                />
              )}
            </FormFieldWrapper>
          </FormSection>
        ) : (
          <PanelSection>
            <Text type="subheading2">고객 정보</Text>
            <PanelRowContainer>
              <PanelLabelContainer>
                <Text type="label">고객명</Text>
              </PanelLabelContainer>
              <PanelValueContainer>
                <Text type="body2">{formData.customer?.customerName}</Text>
              </PanelValueContainer>
            </PanelRowContainer>
            <PanelRowContainer>
              <PanelLabelContainer>
                <Text type="label">휴대폰</Text>
              </PanelLabelContainer>
              <PanelValueContainer>
                <Text type="body2">{formData.customer?.phoneNumber}</Text>
              </PanelValueContainer>
            </PanelRowContainer>
          </PanelSection>
        )}

        {/* --- 차량 정보 섹션 --- */}
        {isEditMode && isStatusPending() ? (
          <>
            {isAvailableVehicleSearch() && (
              <FormSection>
                <FormTitleWrapper>
                  <Text type="subheading2">차량 정보</Text>
                  {isSelectedVehicle && (
                    <MiniButton icon={<EditIcon />} $buttonType="light-gray" onClick={handleCancelVehicle}>
                      변경
                    </MiniButton>
                  )}
                </FormTitleWrapper>
                <FormFieldWrapper>
                  {isSelectedVehicle ? (
                    <VehicleSelectedItem item={formData.vehicle!} />
                  ) : (
                    <SearchText
                      id="vehcle-search"
                      placeholder="차량번호 또는 모델명으로 검색"
                      fetch={(query, signal) =>
                        fetchSearchVehicle(
                          formatDateTime(formData.pickupAt)!,
                          formatDateTime(formData.returnAt)!,
                          query,
                          signal
                        )
                      }
                      renderResults={results =>
                        results &&
                        results.map((item: SearchVehicleSummary) => (
                          <VehicleSearchItem key={item.id} item={item} onClick={handleClickVehicle} />
                        ))
                      }
                    />
                  )}
                </FormFieldWrapper>
              </FormSection>
            )}
          </>
        ) : (
          <PanelSection>
            <Text type="subheading2">차량 정보</Text>
            <PanelRowContainer>
              <PanelLabelContainer>
                <Text type="label">차량번호</Text>
              </PanelLabelContainer>
              <PanelValueContainer>
                <Text type="body2">{formData.vehicle?.registrationNumber}</Text>
              </PanelValueContainer>
            </PanelRowContainer>
            <PanelRowContainer>
              <PanelLabelContainer>
                <Text type="label">제조사</Text>
              </PanelLabelContainer>
              <PanelValueContainer>
                <Text type="body2">{formData.vehicle?.manufacturer}</Text>
              </PanelValueContainer>
            </PanelRowContainer>
            <PanelRowContainer>
              <PanelLabelContainer>
                <Text type="label">모델명</Text>
              </PanelLabelContainer>
              <PanelValueContainer>
                <Text type="body2">{formData.vehicle?.modelName}</Text>
              </PanelValueContainer>
            </PanelRowContainer>
            <PanelRowContainer>
              <PanelLabelContainer>
                <Text type="label">연식</Text>
              </PanelLabelContainer>
              <PanelValueContainer>
                <Text type="body2">{formData.vehicle?.modelYear}</Text>
              </PanelValueContainer>
            </PanelRowContainer>
          </PanelSection>
        )}

        {/* --- 추가 정보 섹션 --- */}
        <PanelSection>
          <TextArea
            id="memo"
            label="비고"
            placeholder="예약에 대한 특이사항을 입력하세요"
            onChange={value => handleInputChange('memo', value)}
            value={formData.memo ?? ''}
            minHeight="120px"
            errorText={errors.memo}
            disabled={!isEditMode}
          />
        </PanelSection>
      </PanelWrapper>
    );
  };

  // --- 최종 렌더링 ---
  return (
    <SlidePanel isOpen={isOpen} onClose={handlePanelClose} title="예약 상세 정보" actions={panelActions}>
      {renderPanelContent()}
    </SlidePanel>
  );
};
