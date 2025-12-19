import React from 'react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="global-header">\
            <h3 className="global-title">{title}</h3>
        </header>
    );
};

export default Header;