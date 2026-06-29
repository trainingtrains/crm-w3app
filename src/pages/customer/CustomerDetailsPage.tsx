import React, { useEffect, useState } from "react";
import { StyledSection } from "../../atoms/StyledSection";
import { PageTitle } from "../../atoms/PageTitle";
import { CONSTANTS } from "../../constants";
import { useNavigate, useParams } from "react-router-dom";
import DetailsView from "../../components/DetailsView";
import { customerDetailsConfig } from "./config/customerConfig";
import { customerService } from "../../services/customerService";

const CustomerDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<any>({});
    useEffect(() => {
        if (!id) return;

        const loadCustomer = async () => {
            try {
                const data = await customerService.getById(id);
                setCustomer(data);
            } catch (err) {
                console.error(err);
            }
        };

        loadCustomer();
    }, [id]);

    const handleDeleteBtnClick = async () => {
        try {
            if (id)
                await customerService.delete(id);

            alert("Customer deleted successfully.");

            navigate(-1);
        } catch (error: any) {
            alert(error.message);
        }
    }

    const onEditClick = () => {
        navigate(`/custEdit/${id}`);
    }

    return (
        <>
            <StyledSection>
                <PageTitle>
                    {CONSTANTS.LBL_CRM_CUST_DETAILS}
                </PageTitle>
            </StyledSection>

            <DetailsView
                config={customerDetailsConfig}
                data={customer}
                actionLabel="Edit"
                onActionClick={onEditClick}
                negativeLabel="Delete"
                onhandleNegativeClick={handleDeleteBtnClick}
            />
        </>
    );
};

export default CustomerDetailsPage;