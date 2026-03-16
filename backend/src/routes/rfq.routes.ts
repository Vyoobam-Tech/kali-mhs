import { Router } from 'express';
import { RFQController } from '@controllers/rfq.controller';
import { validate } from '@middlewares/validate';
import { authenticate, authorize, isAdminOrAbove } from '@middlewares/auth';
import { UserRole } from '@domain/user.interface';
import { uploadRFQFiles, handleUploadError } from '@middlewares/upload';
import {
    createRFQSchema,
    updateRFQSchema,
    getRFQByIdSchema,
    getRFQByNumberSchema,
    getRFQsQuerySchema,
    assignRFQSchema,
    addQuoteSchema,
    acceptRejectRFQSchema,
    searchRFQsSchema,
    submitRFQSchema,
} from '@validations/rfq.validation';

const router = Router();

/**
 * Public Routes
 */

/**
 * @route   POST /api/v1/rfq
 * @desc    Create a new RFQ (public - from website form)
 * @access  Public
 */
router.post(
    '/',
    uploadRFQFiles,
    handleUploadError,
    validate(createRFQSchema),
    RFQController.createRFQ
);

/**
 * @route   POST /api/v1/rfq/:id/submit
 * @desc    Submit RFQ
 * @access  Public (for customer submissions)
 */
router.post('/:id/submit', validate(submitRFQSchema), RFQController.submitRFQ);

/**
 * Protected Routes (Admin & above)
 */

/**
 * @route   GET /api/v1/rfq
 * @desc    Get all RFQs with pagination and filtering
 * @access  Private (Admin, Super Admin)
 */
router.get(
    '/',
    authenticate,
    isAdminOrAbove,
    validate(getRFQsQuerySchema),
    RFQController.getAllRFQs
);

/**
 * @route   GET /api/v1/rfq/stats
 * @desc    Get RFQ statistics
 * @access  Private (Admin, Super Admin)
 */
router.get('/stats', authenticate, isAdminOrAbove, RFQController.getRFQStats);

/**
 * @route   GET /api/v1/rfq/search
 * @desc    Search RFQs
 * @access  Private (Admin, Super Admin)
 */
router.get(
    '/search',
    authenticate,
    isAdminOrAbove,
    validate(searchRFQsSchema),
    RFQController.searchRFQs
);

/**
 * @route   GET /api/v1/rfq/my-rfqs
 * @desc    Get RFQs assigned to current user
 * @access  Private (All authenticated users)
 */
router.get('/my-rfqs', authenticate, RFQController.getMyRFQs);

/**
 * @route   GET /api/v1/rfq/number/:rfqNumber
 * @desc    Get RFQ by RFQ number
 * @access  Private (Admin, Super Admin)
 */
router.get(
    '/number/:rfqNumber',
    authenticate,
    isAdminOrAbove,
    validate(getRFQByNumberSchema),
    RFQController.getRFQByNumber
);

/**
 * @route   GET /api/v1/rfq/:id
 * @desc    Get RFQ by ID
 * @access  Private (Admin, Super Admin)
 */
router.get('/:id', authenticate, isAdminOrAbove, validate(getRFQByIdSchema), RFQController.getRFQById);

/**
 * @route   PUT /api/v1/rfq/:id
 * @desc    Update RFQ
 * @access  Private (Admin, Super Admin)
 */
router.put(
    '/:id',
    authenticate,
    isAdminOrAbove,
    validate(updateRFQSchema),
    RFQController.updateRFQ
);

/**
 * @route   POST /api/v1/rfq/:id/assign
 * @desc    Assign RFQ to a user
 * @access  Private (Admin, Super Admin)
 */
router.post(
    '/:id/assign',
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validate(assignRFQSchema),
    RFQController.assignRFQ
);

/**
 * @route   POST /api/v1/rfq/:id/quote
 * @desc    Add quote to RFQ
 * @access  Private (Admin, Super Admin)
 */
router.post(
    '/:id/quote',
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validate(addQuoteSchema),
    RFQController.addQuote
);

/**
 * @route   POST /api/v1/rfq/:id/accept
 * @desc    Accept RFQ quote
 * @access  Private (Admin, Super Admin)
 */
router.post(
    '/:id/accept',
    authenticate,
    isAdminOrAbove,
    validate(acceptRejectRFQSchema),
    RFQController.acceptRFQ
);

/**
 * @route   POST /api/v1/rfq/:id/reject
 * @desc    Reject RFQ
 * @access  Private (Admin, Super Admin)
 */
router.post(
    '/:id/reject',
    authenticate,
    isAdminOrAbove,
    validate(acceptRejectRFQSchema),
    RFQController.rejectRFQ
);

/**
 * @route   GET /api/v1/rfq/:id/export
 * @desc    Export RFQ as structured JSON for AI integration
 * @access  Private (Admin, Super Admin)
 */
router.get('/:id/export', authenticate, isAdminOrAbove, RFQController.exportRFQ);

export { router };
