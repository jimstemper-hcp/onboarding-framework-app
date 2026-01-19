import { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  alpha,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import { useOnboarding } from '../../context';

export function ProSelectorToolbar() {
  const { pros, activeProId, setActivePro, currentView, setCurrentView } = useOnboarding();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const activePro = pros.find((p) => p.id === activeProId);

  // Disable on admin and sample-pros views
  const isDisabled = currentView === 'admin' || currentView === 'sample-pros';

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectPro = (proId: string) => {
    setActivePro(proId);
    handleClose();
  };

  const handleEditPro = (event: React.MouseEvent, proId: string) => {
    event.stopPropagation();
    handleClose();
    // Navigate to sample-pros view
    setCurrentView('sample-pros');
  };

  const buttonContent = (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      endIcon={!isDisabled && <KeyboardArrowDownIcon />}
      startIcon={<PersonIcon sx={{ fontSize: 16 }} />}
      sx={{
        color: isDisabled ? 'rgba(255,255,255,0.4)' : 'white',
        bgcolor: isDisabled ? 'transparent' : 'rgba(255,255,255,0.1)',
        border: '1px solid',
        borderColor: isDisabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.3)',
        borderRadius: 1.5,
        px: 1.5,
        py: 0.5,
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.8rem',
        minWidth: 140,
        justifyContent: 'flex-start',
        '&:hover': {
          bgcolor: isDisabled ? 'transparent' : 'rgba(255,255,255,0.2)',
          borderColor: isDisabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)',
        },
        '&.Mui-disabled': {
          color: 'rgba(255,255,255,0.4)',
        },
      }}
    >
      <Box sx={{ textAlign: 'left', overflow: 'hidden' }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            lineHeight: 1,
            fontSize: '0.65rem',
            opacity: 0.7,
          }}
        >
          Active Pro
        </Typography>
        <Typography
          sx={{
            fontSize: '0.8rem',
            fontWeight: 600,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 120,
          }}
        >
          {activePro?.companyName || 'Select Pro'}
        </Typography>
      </Box>
    </Button>
  );

  return (
    <Box>
      {isDisabled ? (
        <Tooltip title="Pro selector does not apply to this page" arrow>
          <span>{buttonContent}</span>
        </Tooltip>
      ) : (
        buttonContent
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            mt: 1,
            minWidth: 280,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            SELECT PRO ACCOUNT
          </Typography>
        </Box>
        {pros.map((pro) => {
          const isActive = pro.id === activeProId;
          const planLabel = pro.plan.charAt(0).toUpperCase() + pro.plan.slice(1);

          return (
            <MenuItem
              key={pro.id}
              onClick={() => handleSelectPro(pro.id)}
              sx={{
                py: 1.5,
                px: 2,
                bgcolor: isActive ? alpha('#0062FF', 0.04) : 'transparent',
                '&:hover': {
                  bgcolor: isActive ? alpha('#0062FF', 0.08) : 'action.hover',
                },
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ flex: 1, minWidth: 0 }}
              >
                {/* Check mark for active */}
                <Box sx={{ width: 20, display: 'flex', justifyContent: 'center' }}>
                  {isActive && (
                    <CheckIcon sx={{ fontSize: 18, color: '#0062FF' }} />
                  )}
                </Box>

                {/* Pro info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={isActive ? 600 : 500}
                    sx={{ color: isActive ? '#0062FF' : 'text.primary' }}
                  >
                    {pro.companyName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {pro.ownerName} &bull; {planLabel}
                  </Typography>
                </Box>

                {/* Edit button */}
                <Tooltip title="Edit pro configuration" arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => handleEditPro(e, pro.id)}
                    sx={{
                      opacity: 0.5,
                      '&:hover': {
                        opacity: 1,
                        bgcolor: alpha('#0062FF', 0.1),
                      },
                    }}
                  >
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
