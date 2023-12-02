import { useEffect, useState, useRef } from 'react'
import ReactLoading from 'react-loading'
import cls from './CardsSearchbar.module.scss'
import { useAppDispatch, useAppSelector, useResize } from 'src/shared/lib'
import { SearchbarCardItem, SearchbarCardModal } from 'src/features/decks'
import {
    cardsSelector,
    findCardsStatusSelector,
    findCards,
} from 'src/entities/cards'

interface CardsSearchbarProps {
    setIsSaveDisabled: (b: boolean) => void
}

export const CardsSearchbar = ({ setIsSaveDisabled }: CardsSearchbarProps) => {
    const dispatch = useAppDispatch()
    const [value, setValue] = useState('')
    const cards = useAppSelector(cardsSelector)
    const findCardsStatus = useAppSelector(findCardsStatusSelector)
    const { width } = useResize()
    const [isShowDropdown, setIsShowDropdown] = useState(true)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [modalCard, setModalCard] = useState<CardType | null>(null)

    useEffect(() => {
        if (value) {
            dispatch(findCards({ query: value }))
        }
    }, [value, dispatch])

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => document.removeEventListener('click', handleDocumentClick)
    }, [])

    const handleDocumentClick = (e: MouseEvent) => {
        if (
            dropdownRef.current &&
            dropdownRef.current.contains(e.target as Node)
        ) {
            setIsShowDropdown(false)
        }
    }

    return (
        <>
            <div className={cls.CardsSearchbar}>
                <label className={cls.CardsSearchbarLabel}>
                    <h3 className={cls.CardsSearchbarHeader}>
                        Введите название карты:{' '}
                    </h3>
                    <input
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setValue(e.target.value)
                        }
                        className={cls.CardsSearchbarInput}
                        type="text"
                        placeholder="Вайл..."
                        onFocus={() => setIsShowDropdown(true)}
                    />
                </label>

                {(width > 700 || (isShowDropdown && cards.length)) && (
                    <div
                        className={cls.ResultsContainerWrapper}
                        ref={dropdownRef}
                    >
                        <ul className={cls.ResultsContainer}>
                            {findCardsStatus.isUncompleted && value
                                ? width > 700 && (
                                      <ReactLoading
                                          type={'bubbles'}
                                          color={'#ffffff'}
                                          height={100}
                                          width={90}
                                      />
                                  )
                                : cards.map((res) => (
                                      <SearchbarCardItem
                                          key={res.id}
                                          setIsSaveDisabled={setIsSaveDisabled}
                                          setModalCard={(
                                              card: CardType | null
                                          ) => {
                                              setModalCard(card)
                                              document.body.style.overflow =
                                                  'hidden'
                                          }}
                                          card={res}
                                      />
                                  ))}
                        </ul>
                    </div>
                )}
            </div>
            {modalCard && (
                <SearchbarCardModal
                    card={modalCard}
                    closeModal={() => setModalCard(null)}
                    setIsSaveDisabled={setIsSaveDisabled}
                />
            )}
        </>
    )
}
