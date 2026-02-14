import Icon from "../Icon/Icon";
import styles from "./HomeButton.module.scss";

interface HomeButtonProps {
    className?: string;
}

export default function HomeButton({ className }: HomeButtonProps): JSX.Element {
    return (
        <Icon
            light="../../../public/assets/icons/header/home-button.svg"
            dark="../../../public/assets/icons/header/home-button-dark.svg"
            className={`${styles["home-button"]} ${className}`}
        />
    );
}
